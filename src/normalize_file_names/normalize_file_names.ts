import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log, logSingleLine } from '../logger';
import { getCreationTimeFromFileName, getOutputFileName } from '../file_naming';
import { getCreationTimeFromFs, getFileCount, ensureDirExistsCached } from '../utils';
import processFile from './process_file';
import prepareForProcessing from './prepare_for_processing';

export default async function normalizeFileNames({
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath = path.join((outputDirPath ?? ''), '_UNRECOGNIZED'),
  recognizedFromFsFilesOutputDirPath = path.join((outputDirPath ?? ''), '_RECOGNIZED_FROM_FS'),
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string,
  outputDirPath: string,
  unrecognizedFilesOutputDirPath?: string,
  recognizedFromFsFilesOutputDirPath?: string,
  fetchCreationTimeFromFsForUnrecognizedFiles?: boolean,
  isDryRun?: boolean,
}) {
  let loggingIntervalId;

  try {
    await prepareForProcessing({
      inputDirPath,
      outputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
    });

    const totalFileCount = await getFileCount(inputDirPath);
    let recognizedFileCount = 0;
    let unrecognizedFileCount = 0;

    const ensureUnrecognizedFilesOutputDirCreated = ensureDirExistsCached(
      unrecognizedFilesOutputDirPath,
    );

    const ensureRecognizedFromFsFilesOutputDirCreated = ensureDirExistsCached(
      recognizedFromFsFilesOutputDirPath,
    );

    const logProgress = (): void => {
      if (isDryRun) {
        return;
      }

      const processedFileCount = recognizedFileCount + unrecognizedFileCount;
      const progressPercentage = Math.floor(
        100 * (totalFileCount > 0 ? processedFileCount / totalFileCount : 1),
      );

      logSingleLine(`Processed files: ${processedFileCount}/${totalFileCount} (${progressPercentage}%)`);
    };

    loggingIntervalId = setInterval(logProgress, 200);

    await iterateDirectoryChildren(inputDirPath, async (fsEntry) => {
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

          recognizedFileCount += 1;
        } else if (fetchCreationTimeFromFsForUnrecognizedFiles) {
          if (!isDryRun) {
            await ensureRecognizedFromFsFilesOutputDirCreated();
          }

          const creationTimeFromFs = await getCreationTimeFromFs(fsEntry.absolutePath);

          outputFileDirPath = recognizedFromFsFilesOutputDirPath;
          outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFs);

          unrecognizedFileCount += 1;
        } else {
          if (!isDryRun) {
            await ensureUnrecognizedFilesOutputDirCreated();
          }

          outputFileDirPath = unrecognizedFilesOutputDirPath;
          outputFileName = fsEntry.name;

          unrecognizedFileCount += 1;
        }

        const outputFilePath = path.join(outputFileDirPath, outputFileName);

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
    log(`Recognized files: ${recognizedFileCount}`);
    log(`Unrecognized files: ${unrecognizedFileCount}`);
  } finally {
    if (loggingIntervalId) {
      clearInterval(loggingIntervalId);
    }
  }
}
