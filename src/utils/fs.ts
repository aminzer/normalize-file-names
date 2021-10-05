import * as fs from 'fs/promises';
import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';

export async function getFileCount(dirPath: string): Promise<number> {
  let fileCount = 0;

  await iterateDirectoryChildren(dirPath, (fsEntry) => {
    if (fsEntry.isFile) {
      fileCount += 1;
    }
  });

  return fileCount;
}

export async function isDirExist(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

export async function isFileExist(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

export async function ensureDirExists(dirPath: string): Promise<void> {
  if (!await isDirExist(dirPath)) {
    await fs.mkdir(dirPath);
  }
}

export async function getCreationTimeFromFs(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.birthtime.valueOf();
}

function getNextPossibleFilePath(filePath: string) {
  const { dir, name, ext } = path.parse(filePath);
  const matchArray = name.match(/^(.+)__(\d+)$/);

  const baseName = matchArray ? matchArray[1] : name;
  const postfix = matchArray ? (+matchArray[2] + 1) : 1;

  return path.join(dir, `${baseName}__${postfix}${ext}`);
}

async function getNonExistentFilePath(possibleFilePath: string): Promise<string> {
  if (!await isFileExist(possibleFilePath)) {
    return possibleFilePath;
  }

  return getNonExistentFilePath(getNextPossibleFilePath(possibleFilePath));
}

export async function copyFile(
  sourceFilePath: string,
  targetFilePath: string, {
    overwriteIfExists = false,
    keepSeparateIfExists = false,
  }: {
    overwriteIfExists?: boolean,
    keepSeparateIfExists?: boolean,
  } = {},
): Promise<void> {
  if (!isFileExist(targetFilePath) || overwriteIfExists) {
    await fs.copyFile(sourceFilePath, targetFilePath);
    return;
  }

  if (keepSeparateIfExists) {
    const separateTargetFilePath = await getNonExistentFilePath(targetFilePath);
    await fs.copyFile(sourceFilePath, separateTargetFilePath);
    return;
  }

  throw new Error(`File "${targetFilePath}" already exists"`);
}
