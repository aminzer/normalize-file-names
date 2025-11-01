import { traverseDirectory } from '@aminzer/traverse-directory';
import { LoggerInterface } from '../logging/index.js';

const getFileCount = async ({
  dirPath,
  logger,
}: {
  dirPath: string;
  logger: LoggerInterface;
}): Promise<number> => {
  let fileCount = 0;

  const logProgress = (): void => {
    logger.logSingleLine(`Counting files in "${dirPath}" (${fileCount} found)...\n`);
  };

  const loggingIntervalId = setInterval(logProgress, 200);

  await traverseDirectory(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  clearInterval(loggingIntervalId);

  logger.logSingleLine(`Directory "${dirPath}" contains ${fileCount} files.\n`);

  return fileCount;
};

export default getFileCount;
