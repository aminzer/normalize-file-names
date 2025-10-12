import { mkdir, open, readdir, rmdir, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export const createDir = async (dirPath: string): Promise<void> => {
  await mkdir(dirPath);
};

export const createFile = async (filePath: string): Promise<void> => {
  const fileHandle = await open(filePath, 'w');
  await fileHandle.close();
};

export const deleteDir = async (dirPath: string): Promise<void> => {
  const childNames: string[] = await readdir(dirPath);

  for (const childName of childNames) {
    const childPath = join(dirPath, childName);
    const childStats = await stat(childPath);

    if (childStats.isDirectory()) {
      await deleteDir(childPath);
    } else {
      await unlink(childPath);
    }
  }

  await rmdir(dirPath);
};

const getChildrenNames = async (
  dirPath: string,
  {
    filesOnly = false,
    dirsOnly = false,
  }: {
    filesOnly?: boolean;
    dirsOnly?: boolean;
  } = {},
): Promise<string[]> => {
  const childNames: string[] = await readdir(dirPath);
  const filteredChildNames: string[] = [];

  for (const childName of childNames) {
    const childPath = join(dirPath, childName);
    const childStats = await stat(childPath);

    if (filesOnly && !childStats.isFile()) {
      continue;
    }

    if (dirsOnly && !childStats.isDirectory()) {
      continue;
    }

    filteredChildNames.push(childName);
  }

  return filteredChildNames;
};

export const getDirNames = async (dirPath: string): Promise<string[]> => {
  return getChildrenNames(dirPath, { dirsOnly: true });
};

export const getFileNames = async (dirPath: string): Promise<string[]> => {
  return getChildrenNames(dirPath, { filesOnly: true });
};
