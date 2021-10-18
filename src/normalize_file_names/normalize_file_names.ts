import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log, logSingleLine } from '../logger';
import { getCreationTimeFromFileName, getOutputFileName } from '../file_naming';
import { getCreationTimeFromFs, getFileCount } from '../utils';
import processFile from './process_file';
import prepareForProcessing from './prepare_for_processing';

export default async function normalizeFileNames({
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath = path.join(outputDirPath || '', '_UNRECOGNIZED'),
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string,
  outputDirPath: string,
  unrecognizedFilesOutputDirPath?: string,
  fetchCreationTimeFromFsForUnrecognizedFiles?: boolean,
  isDryRun?: boolean,
}) {
  let loggingIntervalId;

  try {
    await prepareForProcessing({
      inputDirPath,
      outputDirPath,
      unrecognizedFilesOutputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
    });

    const totalFileCount = await getFileCount(inputDirPath);
    let recognizedFileCount = 0;
    let unrecognizedFileCount = 0;

    const logProgress = (): void => {
      if (isDryRun) {
        return;
      }

      const processedFileCount = recognizedFileCount + unrecognizedFileCount;
      const progressPercentage = Math.round(
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

        let outputFilePath;
        const creationTimeFromFileName = getCreationTimeFromFileName(fsEntry.name);

        if (creationTimeFromFileName !== null) {
          const outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFileName);

          outputFilePath = path.join(outputDirPath, outputFileName);
          recognizedFileCount += 1;
        } else {
          let outputFileName = fsEntry.name;

          if (fetchCreationTimeFromFsForUnrecognizedFiles) {
            const creationTimeFromFs = await getCreationTimeFromFs(fsEntry.absolutePath);
            outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFs);
          }

          outputFilePath = path.join(unrecognizedFilesOutputDirPath, outputFileName);
          unrecognizedFileCount += 1;
        }

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
