import { promises as fs } from 'fs';
import getNonExistentFilePath from './get_non_existent_file_path';
import isFileExist from './is_file_exist';

export default async function copyFile(
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
