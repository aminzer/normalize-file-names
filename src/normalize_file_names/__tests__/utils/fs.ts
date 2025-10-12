import { mkdir, open, readdir, rmdir, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export async function createDir(dirPath: string): Promise<void> {
  await mkdir(dirPath);
}

export async function createFile(filePath: string): Promise<void> {
  const fileHandle = await open(filePath, 'w');
  await fileHandle.close();
}

export async function deleteDir(dirPath: string): Promise<void> {
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
}

async function getChildrenNames(
  dirPath: string,
  {
    filesOnly = false,
    dirsOnly = false,
  }: {
    filesOnly?: boolean;
    dirsOnly?: boolean;
  } = {},
): Promise<string[]> {
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
}

export async function getDirNames(dirPath: string): Promise<string[]> {
  return getChildrenNames(dirPath, { dirsOnly: true });
}

export async function getFileNames(dirPath: string): Promise<string[]> {
  return getChildrenNames(dirPath, { filesOnly: true });
}
