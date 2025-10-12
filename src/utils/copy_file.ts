import { copyFile as copyFileFs } from 'node:fs/promises';
import getNonExistentFileVersionPath from './get_non_existent_file_version_path.js';
import isFileExist from './is_file_exist.js';

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
  if (!isFileExist(targetFilePath) || overwriteIfExists) {
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
