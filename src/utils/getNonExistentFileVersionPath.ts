import getNextFileVersionPath from './getNextFileVersionPath.js';
import fileExists from './fileExists.js';

export default async function getNonExistentFileVersionPath(
  possibleFilePath: string,
): Promise<string> {
  if (!(await fileExists(possibleFilePath))) {
    return possibleFilePath;
  }

  return getNonExistentFileVersionPath(getNextFileVersionPath(possibleFilePath));
}
