import { traverseDirectory } from '@aminzer/traverse-directory';

export default async function getFileCount(dirPath: string): Promise<number> {
  let fileCount = 0;

  await traverseDirectory(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  return fileCount;
}
