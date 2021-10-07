import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log, logSingleLine } from './logger';
import {
  getCreationTimeFromFileName,
  getOutputFileName,
} from './file_naming';
import {
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
  validateConfig,
} from './config';
import {
  copyFile,
  ensureDirExists,
  getCreationTimeFromFs,
  getFileCount,
} from './utils';

async function processFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
  if (isDryRun) {
    log(`"${path.parse(sourceFilePath).base}" -> "${path.parse(targetFilePath).base}"`);
    return;
  }

  await copyFile(sourceFilePath, targetFilePath, {
    keepSeparateIfExists: true,
  });
}

(async () => {
  try {
    await validateConfig();

    if (!isDryRun) {
      await ensureDirExists(unrecognizedFilesOutputDirPath);
    }

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

    const loggingIntervalId = setInterval(logProgress, 200);

    await iterateDirectoryChildren(inputDirPath, async (fsEntry) => {
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

      await processFile(fsEntry.absolutePath, outputFilePath);
    });

    clearInterval(loggingIntervalId);

    logProgress();
    log();
    log(`Recognized files: ${recognizedFileCount}`);
    log(`Unrecognized files: ${unrecognizedFileCount}`);
  } catch (err) {
    log(err);
  }
})();
