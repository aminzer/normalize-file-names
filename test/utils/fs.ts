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
  await fs.rmdir(dirPath, { recursive: true });
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
  const names: string[] = await fs.readdir(dirPath);
  const filteredNames: string[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const name of names) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await fs.stat(path.join(dirPath, name));

    if (filesOnly && !stats.isFile()) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (dirsOnly && !stats.isDirectory()) {
      // eslint-disable-next-line no-continue
      continue;
    }

    filteredNames.push(name);
  }

  return filteredNames;
}

export async function getDirNames(dirPath: string): Promise<string[]> {
  return getChildrenNames(dirPath, { dirsOnly: true });
}

export async function getFileNames(dirPath: string): Promise<string[]> {
  return getChildrenNames(dirPath, { filesOnly: true });
}
