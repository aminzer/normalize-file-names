import getNextFileVersionPath from './getNextFileVersionPath.js';
import getNonExistentFileVersionPath from './getNonExistentFileVersionPath.js';

/**
 * Returns a "getNonExistentFileVersionPath" function that remembers the version path returned for
 * each requested path, and continues the search from it on the next call for the same path.
 *
 * Without it, every file whose name is already taken is probed starting from the original path,
 * which results in O(N^2) file system calls for N files sharing the same output name - a common
 * case, since all files recognized as the same date get the same output name.
 */
const getNonExistentFileVersionPathCached = (): ((possibleFilePath: string) => Promise<string>) => {
  const lastVersionPaths = new Map<string, string>();

  return async (possibleFilePath: string): Promise<string> => {
    const lastVersionPath = lastVersionPaths.get(possibleFilePath);

    const searchStartPath = lastVersionPath
      ? getNextFileVersionPath(lastVersionPath)
      : possibleFilePath;

    const versionPath = await getNonExistentFileVersionPath(searchStartPath);

    lastVersionPaths.set(possibleFilePath, versionPath);

    return versionPath;
  };
};

export default getNonExistentFileVersionPathCached;
