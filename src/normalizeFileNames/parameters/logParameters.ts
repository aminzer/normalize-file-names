import { LoggerInterface } from '../../logging/index.js';

const logParameters = async ({
  inputDirPath,
  outputDirPath,
  isFileSystemMetadataFallbackEnabled = false,
  isDryRun = false,
  logger,
}: {
  inputDirPath: string;
  outputDirPath: string;
  isFileSystemMetadataFallbackEnabled: boolean;
  isDryRun: boolean;
  logger: LoggerInterface;
}): Promise<void> => {
  logger.log(`Input directory: "${inputDirPath}"`);
  logger.log(`Output directory: "${outputDirPath}"`);
  if (isDryRun) {
    logger.log("! This is dry run: files won't be copied to the output directory");
  }
  if (isFileSystemMetadataFallbackEnabled) {
    logger.log(
      '! For unrecognized file names creation time will be fetched from file system file metadata',
    );
  }
  logger.log('');
};

export default logParameters;
