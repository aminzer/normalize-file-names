import { parse } from 'node:path';
import { LoggerInterface } from '../../logging/index.js';
import { copyFile } from '../../utils/index.js';

const processFile = async ({
  inputFilePath,
  outputFilePath,
  isRecognizedFromFsMetadata,
  isDryRun,
  logger,
}: {
  inputFilePath: string;
  outputFilePath: string;
  isRecognizedFromFsMetadata: boolean;
  isDryRun: boolean;
  logger: LoggerInterface;
}): Promise<void> => {
  if (isDryRun) {
    logger.log(
      `"${parse(inputFilePath).base}" -> "${parse(outputFilePath).base}"${isRecognizedFromFsMetadata ? ' [from FS metadata]' : ''}`,
    );
    return;
  }

  await copyFile(inputFilePath, outputFilePath, {
    saveAsNewFileVersionIfExists: true,
  });
};

export default processFile;
