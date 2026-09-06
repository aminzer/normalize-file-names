import { parse } from 'node:path';
import { LoggerInterface } from '../../logging/index.js';
import { copyFile } from '../../utils/index.js';

const processFile = async ({
  inputFilePath,
  outputFilePath,
  isRecognizedFromFsMetadata,
  isDryRun,
  getFileVersionPath,
  logger,
}: {
  inputFilePath: string;
  outputFilePath: string;
  isRecognizedFromFsMetadata: boolean;
  isDryRun: boolean;
  getFileVersionPath?: (possibleFilePath: string) => Promise<string>;
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
    getFileVersionPath,
  });
};

export default processFile;
