import { LoggerInterface } from '../logging/index.js';

const logParameters = async ({
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
}): Promise<void> => {
  logger.log(`Input directory: "${inputDirPath}"`);
  logger.log(`Output directory: "${outputDirPath}"`);
  if (isDryRun) {
    logger.log("! This is dry run: files won't be copied to the output directory");
  }
  if (fetchCreationTimeFromFsForUnrecognizedFiles) {
    logger.log('! For unrecognized file names creation time will be fetched from FS attributes');
  }
  logger.log('');
};

export default logParameters;
