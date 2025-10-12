import { parse } from 'node:path';
import { LoggerInterface } from '../logging/index.js';
import { copyFile } from '../utils/index.js';

const processFile = async ({
  inputFilePath,
  outputFilePath,
  isDryRun,
  logger,
}: {
  inputFilePath: string;
  outputFilePath: string;
  isDryRun: boolean;
  logger: LoggerInterface;
}): Promise<void> => {
  if (isDryRun) {
    logger.log(`"${parse(inputFilePath).base}" -> "${parse(outputFilePath).base}"`);
    return;
  }

  await copyFile(inputFilePath, outputFilePath, {
    saveAsNewFileVersionIfExists: true,
  });
};

export default processFile;
