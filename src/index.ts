import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log, logSingleLine } from './logger';
import {
  getCreationTimeFromFileName,
  getOutputFileName,
} from './utils/file_naming';
import {
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath,
  validateConfig,
} from './config';
import {
  ensureDirExists,
  getFileCount,
  getCreationTimeFromFs,
  copyFile,
} from './utils/fs';

async function processFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
  await copyFile(sourceFilePath, targetFilePath, {
    keepSeparateIfExists: true,
  });
}

(async () => {
  try {
    await validateConfig();

    await ensureDirExists(unrecognizedFilesOutputDirPath);

    const totalFileCount = await getFileCount(inputDirPath);
    let recognizedFileCount = 0;
    let unrecognizedFileCount = 0;

    const logProgress = () => {
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

      let creationTime;
      let targetDirPath;

      const creationTimeFromFileName = getCreationTimeFromFileName(fsEntry.name);

      if (creationTimeFromFileName !== null) {
        creationTime = creationTimeFromFileName;
        targetDirPath = outputDirPath;
        recognizedFileCount += 1;
      } else {
        creationTime = await getCreationTimeFromFs(fsEntry.absolutePath);
        targetDirPath = unrecognizedFilesOutputDirPath;
        unrecognizedFileCount += 1;
      }

      const outputFileName = getOutputFileName(fsEntry.name, creationTime);
      const outputFilePath = path.join(targetDirPath, outputFileName);

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
