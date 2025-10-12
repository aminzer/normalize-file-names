import { traverseDirectory } from '@aminzer/traverse-directory';

const getFileCount = async (dirPath: string): Promise<number> => {
  let fileCount = 0;

  await traverseDirectory(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  return fileCount;
};

export default getFileCount;
