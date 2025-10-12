import { join } from 'node:path';
import { traverseDirectory } from '@aminzer/traverse-directory';
import { getCreationTimeFromFileName, getOutputFileName } from '../fileNaming/index.js';
import { LoggerInterface } from '../logging/index.js';
import {
  getCreationTimeFromFs,
  getFileCount,
  createDirectoryIfNotExistsCached,
} from '../utils/index.js';
import processFile from './processFile.js';
import logParameters from './logParameters.js';
import validateParameters from './validateParameters.js';

const normalizeFileNames = async ({
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath = join(outputDirPath ?? '', '_UNRECOGNIZED'),
  recognizedFromFsFilesOutputDirPath = join(outputDirPath ?? '', '_RECOGNIZED_FROM_FS'),
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
  logger,
}: {
  inputDirPath: string;
  outputDirPath: string;
  unrecognizedFilesOutputDirPath?: string;
  recognizedFromFsFilesOutputDirPath?: string;
  fetchCreationTimeFromFsForUnrecognizedFiles?: boolean;
  isDryRun?: boolean;
  logger: LoggerInterface;
}) => {
  let loggingIntervalId;

  try {
    await validateParameters({ inputDirPath, outputDirPath });

    await logParameters({
      inputDirPath,
      outputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
      logger,
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

      logger.logSingleLine(`Processed files: ${processed}/${total} (${progressPercentage}%)`);
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
          logger,
        });
      } catch (err) {
        logger.log('');
        logger.log(`Error during processing "${fsEntry.absolutePath}":`);
        throw err;
      }
    });

    logProgress();
    logger.log('');
    logger.log(`Recognized files (from name): ${fileCount.recognizedFromName}`);
    if (fetchCreationTimeFromFsForUnrecognizedFiles) {
      logger.log(`Recognized files (from FS timestamps): ${fileCount.recognizedFromName}`);
    } else {
      logger.log(`Unrecognized files: ${fileCount.unrecognized}`);
    }
  } finally {
    if (loggingIntervalId) {
      clearInterval(loggingIntervalId);
    }
  }
};

export default normalizeFileNames;
