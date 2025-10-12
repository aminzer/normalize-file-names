import { directoryExists } from '@aminzer/traverse-directory';
import { log } from '../logger/index.js';

export default async function prepareForProcessing({
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string;
  outputDirPath: string;
  fetchCreationTimeFromFsForUnrecognizedFiles: boolean;
  isDryRun: boolean;
}): Promise<void> {
  if (!inputDirPath) {
    throw new Error('Input dir path not set');
  }

  if (!(await directoryExists(inputDirPath))) {
    throw new Error(`Input dir path "${inputDirPath}" doesn't exist`);
  }

  if (!outputDirPath) {
    throw new Error('Output dir path not set');
  }

  if (!(await directoryExists(outputDirPath))) {
    throw new Error(`Output dir path "${outputDirPath}" doesn't exist`);
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
}
