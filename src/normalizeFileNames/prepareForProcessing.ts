import { directoryExists } from '@aminzer/traverse-directory';
import { LoggerInterface } from '../logging/index.js';

export default async function prepareForProcessing({
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
  logger,
}: {
  inputDirPath: string;
  outputDirPath: string;
  fetchCreationTimeFromFsForUnrecognizedFiles: boolean;
  isDryRun: boolean;
  logger: LoggerInterface;
}): Promise<void> {
  if (!inputDirPath) {
    throw new Error('Input directory path not set');
  }

  if (!(await directoryExists(inputDirPath))) {
    throw new Error(`Input directory path "${inputDirPath}" doesn't exist`);
  }

  if (!outputDirPath) {
    throw new Error('Output directory path not set');
  }

  if (!(await directoryExists(outputDirPath))) {
    throw new Error(`Output directory path "${outputDirPath}" doesn't exist`);
  }

  logger.log(`Input directory: "${inputDirPath}"`);
  logger.log(`Output directory: "${outputDirPath}"`);
  if (isDryRun) {
    logger.log("! This is dry run: files won't be copied to the output directory");
  }
  if (fetchCreationTimeFromFsForUnrecognizedFiles) {
    logger.log('! For unrecognized file names creation time will be fetched from FS attributes');
  }
  logger.log('');
}
