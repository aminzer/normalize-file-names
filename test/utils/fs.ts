/* eslint-disable no-restricted-syntax, no-await-in-loop, no-continue */
import { promises as fs } from 'fs';
import * as path from 'path';

export async function createDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath);
}

export async function createFile(filePath: string): Promise<void> {
  const fileHandle = await fs.open(filePath, 'w');
  await fileHandle.close();
}

export async function deleteDir(dirPath: string): Promise<void> {
  const childNames: string[] = await fs.readdir(dirPath);

  for (const childName of childNames) {
    const childPath = path.join(dirPath, childName);
    const childStats = await fs.stat(childPath);

    if (childStats.isDirectory()) {
      await deleteDir(childPath);
    } else {
      await fs.unlink(childPath);
    }
  }

  await fs.rmdir(dirPath);
}

async function getChildrenNames(
  dirPath: string, {
    filesOnly = false,
    dirsOnly = false,
  }: {
    filesOnly?: boolean;
    dirsOnly?: boolean;
  } = {},
): Promise<string[]> {
  const childNames: string[] = await fs.readdir(dirPath);
  const filteredChildNames: string[] = [];

  for (const childName of childNames) {
    const childPath = path.join(dirPath, childName);
    const childStats = await fs.stat(childPath);

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
