import { iterateDirectoryChildren } from '@aminzer/dir-diff';

export { copyFile, stat } from 'fs/promises';

export async function getFileCount(dirPath: string): Promise<number> {
  let fileCount = 0;

  await iterateDirectoryChildren(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  return fileCount;
}

// TODO impl
// export async function isDirExist(path: string): Promise<boolean> {
//   try {
//     const stats = await stat(path);
//     return stats.isDirectory();
//   } catch (err) {
//     return false;
//   }
// }

// export function ensureDirExists(dirPath: string): Promise<void> {
// // TODO impl
// }
