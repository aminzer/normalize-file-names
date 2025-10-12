import { copyFile as copyFileFs } from 'node:fs/promises';
import getNonExistentFileVersionPath from './getNonExistentFileVersionPath.js';
import fileExists from './fileExists.js';

export default async function copyFile(
  sourceFilePath: string,
  targetFilePath: string,
  {
    overwriteIfExists = false,
    keepSeparateIfExists = false,
  }: {
    overwriteIfExists?: boolean;
    keepSeparateIfExists?: boolean;
  } = {},
): Promise<void> {
  if (!fileExists(targetFilePath) || overwriteIfExists) {
    await copyFileFs(sourceFilePath, targetFilePath);
    return;
  }

  if (keepSeparateIfExists) {
    const separateTargetFilePath = await getNonExistentFileVersionPath(targetFilePath);
    await copyFileFs(sourceFilePath, separateTargetFilePath);
    return;
  }

  throw new Error(`File "${targetFilePath}" already exists"`);
}
