import getNextFileVersionPath from './getNextFileVersionPath.js';
import fileExists from './fileExists.js';

const getNonExistentFileVersionPath = async (possibleFilePath: string): Promise<string> => {
  if (!(await fileExists(possibleFilePath))) {
    return possibleFilePath;
  }

  return getNonExistentFileVersionPath(getNextFileVersionPath(possibleFilePath));
};

export default getNonExistentFileVersionPath;
