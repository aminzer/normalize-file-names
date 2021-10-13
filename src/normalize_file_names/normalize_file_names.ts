import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log, logSingleLine } from '../logger';
import {
  getCreationTimeFromFileName,
  getOutputFileName,
} from '../file_naming';
import {
  ensureDirExists,
  getCreationTimeFromFs,
  getFileCount,
} from '../utils';
import validateArgs from './validate_args';
import processFile from './process_file';

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
  await validateArgs({ inputDirPath, outputDirPath });

  if (!isDryRun) {
    await ensureDirExists(unrecognizedFilesOutputDirPath);
  }

  log(`Input dir: "${inputDirPath}"`);
  log(`Output dir: "${outputDirPath}"`);
  if (isDryRun) {
    log("! This is dry run: files won't be copied to the output dir");
  }
  if (fetchCreationTimeFromFsForUnrecognizedFiles) {
    log('! For unrecognized file names creation time will be fetched from FS attributes');
  }
  log();

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

    await processFile({
      inputFilePath: fsEntry.absolutePath,
      outputFilePath,
      isDryRun,
    });
  });

  clearInterval(loggingIntervalId);

  logProgress();
  log();
  log(`Recognized files: ${recognizedFileCount}`);
  log(`Unrecognized files: ${unrecognizedFileCount}`);
}
