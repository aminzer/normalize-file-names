import { copyFile as copyFileFs } from 'node:fs/promises';
import getNonExistentFileVersionPath from './getNonExistentFileVersionPath.js';
import fileExists from './fileExists.js';

const copyFile = async (
  sourceFilePath: string,
  targetFilePath: string,
  {
    overwriteIfExists = false,
    saveAsNewFileVersionIfExists = false,
  }: {
    overwriteIfExists?: boolean;
    saveAsNewFileVersionIfExists?: boolean;
  } = {},
): Promise<void> => {
  const targetFileExists = await fileExists(targetFilePath);

  if (!targetFileExists || overwriteIfExists) {
    await copyFileFs(sourceFilePath, targetFilePath);
    return;
  }

  if (saveAsNewFileVersionIfExists) {
    const targetFileVersionPath = await getNonExistentFileVersionPath(targetFilePath);
    await copyFileFs(sourceFilePath, targetFileVersionPath);
    return;
  }

  throw new Error(`File "${targetFilePath}" already exists"`);
};

export default copyFile;
