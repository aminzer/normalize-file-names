import { iterateDirectoryChildren } from '@aminzer/dir-diff';

export default async function getFileCount(dirPath: string): Promise<number> {
  let fileCount = 0;

  await iterateDirectoryChildren(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  return fileCount;
}
