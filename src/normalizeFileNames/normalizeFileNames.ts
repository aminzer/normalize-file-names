import { join } from 'node:path';
import { traverseDirectory } from '@aminzer/traverse-directory';
import {
  getCreationTimeFromFileName,
  getCreationTimeFromFileSystem,
} from '../fileCreationTimeParsing/index.js';
import { LoggerInterface } from '../logging/index.js';
import { getFileCount, createDirectoryIfNotExistsCached } from '../utils/index.js';
import { getOutputFileName, processFile } from './fileProcessing/index.js';
import { logParameters, validateParameters } from './parameters/index.js';

const normalizeFileNames = async ({
  inputDirPath,
  outputDirPath,
  outputFileNameFormat,
  unrecognizedFilesOutputDirPath = join(outputDirPath ?? '', '_UNRECOGNIZED'),
  recognizedFromFsFilesOutputDirPath = join(outputDirPath ?? '', '_RECOGNIZED_FROM_FS'),
  isFileSystemMetadataFallbackEnabled = false,
  isDryRun = false,
  logger,
}: {
  inputDirPath: string;
  outputDirPath: string;
  outputFileNameFormat: string;
  unrecognizedFilesOutputDirPath?: string;
  recognizedFromFsFilesOutputDirPath?: string;
  isFileSystemMetadataFallbackEnabled?: boolean;
  isDryRun?: boolean;
  logger: LoggerInterface;
}) => {
  let loggingIntervalId;

  try {
    await validateParameters({ inputDirPath, outputDirPath });

    await logParameters({
      inputDirPath,
      outputDirPath,
      isFileSystemMetadataFallbackEnabled,
      isDryRun,
      logger,
    });

    const totalFileCount = await getFileCount({ dirPath: inputDirPath, logger });

    const fileCount = {
      total: totalFileCount,
      recognizedFromName: 0,
      recognizedFromFsMetadata: 0,
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

      const { total, recognizedFromName, recognizedFromFsMetadata, unrecognized } = fileCount;

      const processed = recognizedFromName + recognizedFromFsMetadata + unrecognized;

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
        let isRecognizedFromFsMetadata = false;

        const creationTimeFromFileName = getCreationTimeFromFileName(fsEntry.name);

        if (creationTimeFromFileName !== null) {
          outputFileDirPath = outputDirPath;
          outputFileName = getOutputFileName({
            inputFileName: fsEntry.name,
            creationTime: creationTimeFromFileName,
            outputFileNameFormat,
          });

          fileCount.recognizedFromName += 1;
        } else if (isFileSystemMetadataFallbackEnabled) {
          if (!isDryRun) {
            await ensureRecognizedFromFsFilesOutputDirCreated();
          }

          const creationTimeFromFs = await getCreationTimeFromFileSystem(fsEntry.absolutePath);

          outputFileDirPath = recognizedFromFsFilesOutputDirPath;
          outputFileName = getOutputFileName({
            inputFileName: fsEntry.name,
            creationTime: creationTimeFromFs!,
            outputFileNameFormat,
          });

          isRecognizedFromFsMetadata = true;
          fileCount.recognizedFromFsMetadata += 1;
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
          isRecognizedFromFsMetadata,
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

    if (fileCount.recognizedFromName > 0) {
      logger.log(`Recognized from name: ${fileCount.recognizedFromName}`);
    }

    if (fileCount.recognizedFromFsMetadata > 0) {
      logger.log(`Recognized from FS metadata: ${fileCount.recognizedFromFsMetadata}`);
    }

    if (fileCount.unrecognized > 0) {
      logger.log(`Unrecognized: ${fileCount.unrecognized}`);
    }
  } finally {
    if (loggingIntervalId) {
      clearInterval(loggingIntervalId);
    }
  }
};

export default normalizeFileNames;
