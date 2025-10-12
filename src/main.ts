import { LoggerInterface } from './logging/index.js';
import normalizeFileNames from './normalizeFileNames/index.js';

const main = async ({
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
  logger,
}: {
  inputDirPath: string;
  outputDirPath: string;
  fetchCreationTimeFromFsForUnrecognizedFiles?: boolean;
  isDryRun?: boolean;
  logger: LoggerInterface;
}): Promise<void> => {
  try {
    await normalizeFileNames({
      inputDirPath,
      outputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
      logger,
    });
  } catch (err) {
    logger.log('');

    if (err instanceof Error) {
      logger.log(`Error: ${err.message}`);
    } else {
      logger.log(`Unknown error: ${err}`);
    }
  }
};

export default main;
