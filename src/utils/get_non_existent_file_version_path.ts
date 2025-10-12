import getNextFileVersionPath from './get_next_file_version_path.js';
import isFileExist from './is_file_exist.js';

export default async function getNonExistentFileVersionPath(
  possibleFilePath: string,
): Promise<string> {
  if (!(await isFileExist(possibleFilePath))) {
    return possibleFilePath;
  }

  return getNonExistentFileVersionPath(getNextFileVersionPath(possibleFilePath));
}
