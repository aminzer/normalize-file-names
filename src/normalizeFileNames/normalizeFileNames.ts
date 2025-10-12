import { join } from 'node:path';
import { traverseDirectory } from '@aminzer/traverse-directory';
import { log, logSingleLine } from '../logger/index.js';
import { getCreationTimeFromFileName, getOutputFileName } from '../fileNaming/index.js';
import {
  getCreationTimeFromFs,
  getFileCount,
  createDirectoryIfNotExistsCached,
} from '../utils/index.js';
import processFile from './processFile.js';
import prepareForProcessing from './prepareForProcessing.js';

export default async function normalizeFileNames({
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath = join(outputDirPath ?? '', '_UNRECOGNIZED'),
  recognizedFromFsFilesOutputDirPath = join(outputDirPath ?? '', '_RECOGNIZED_FROM_FS'),
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string;
  outputDirPath: string;
  unrecognizedFilesOutputDirPath?: string;
  recognizedFromFsFilesOutputDirPath?: string;
  fetchCreationTimeFromFsForUnrecognizedFiles?: boolean;
  isDryRun?: boolean;
}) {
  let loggingIntervalId;

  try {
    await prepareForProcessing({
      inputDirPath,
      outputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
    });

    const fileCount = {
      total: await getFileCount(inputDirPath),
      recognizedFromName: 0,
      recognizedFromFs: 0,
      unrecognized: 0,
    };

    const ensureUnrecognizedFilesOutputDirCreated = createDirectoryIfNotExistsCached(
      unrecognizedFilesOutputDirPath,
    );

    const ensureRecognizedFromFsFilesOutputDirCreated = createDirectoryIfNotExistsCached(
      recognizedFromFsFilesOutputDirPath,
    );

    const logProgress = (): void => {
      if (isDryRun) {
        return;
      }

      const { total, recognizedFromName, recognizedFromFs, unrecognized } = fileCount;

      const processed = recognizedFromName + recognizedFromFs + unrecognized;

      const progressPercentage = Math.floor(100 * (total > 0 ? processed / total : 1));

      logSingleLine(`Processed files: ${processed}/${total} (${progressPercentage}%)`);
    };

    loggingIntervalId = setInterval(logProgress, 200);

    await traverseDirectory(inputDirPath, async (fsEntry) => {
      try {
        if (fsEntry.isDirectory) {
          return;
        }

        let outputFileDirPath: string;
        let outputFileName: string;

        const creationTimeFromFileName = getCreationTimeFromFileName(fsEntry.name);

        if (creationTimeFromFileName !== null) {
          outputFileDirPath = outputDirPath;
          outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFileName);

          fileCount.recognizedFromName += 1;
        } else if (fetchCreationTimeFromFsForUnrecognizedFiles) {
          if (!isDryRun) {
            await ensureRecognizedFromFsFilesOutputDirCreated();
          }

          const creationTimeFromFs = await getCreationTimeFromFs(fsEntry.absolutePath);

          outputFileDirPath = recognizedFromFsFilesOutputDirPath;
          outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFs);

          fileCount.recognizedFromFs += 1;
        } else {
          if (!isDryRun) {
            await ensureUnrecognizedFilesOutputDirCreated();
          }

          outputFileDirPath = unrecognizedFilesOutputDirPath;
          outputFileName = fsEntry.name;

          fileCount.unrecognized += 1;
        }

        const outputFilePath = join(outputFileDirPath, outputFileName);

        await processFile({
          inputFilePath: fsEntry.absolutePath,
          outputFilePath,
          isDryRun,
        });
      } catch (err) {
        log();
        log(`Error during processing "${fsEntry.absolutePath}":`);
        throw err;
      }
    });

    logProgress();
    log();
    log(`Recognized files (from name): ${fileCount.recognizedFromName}`);
    if (fetchCreationTimeFromFsForUnrecognizedFiles) {
      log(`Recognized files (from FS timestamps): ${fileCount.recognizedFromName}`);
    } else {
      log(`Unrecognized files: ${fileCount.unrecognized}`);
    }
  } finally {
    if (loggingIntervalId) {
      clearInterval(loggingIntervalId);
    }
  }
}
