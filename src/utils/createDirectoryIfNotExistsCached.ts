import { mkdir } from 'node:fs/promises';
import { directoryExists } from '@aminzer/traverse-directory';

const createDirectoryIfNotExistsCached = (dirPath: string): (() => Promise<void>) => {
  let isDirCreated = false;

  return async (): Promise<void> => {
    if (isDirCreated) {
      return;
    }

    if (!(await directoryExists(dirPath))) {
      await mkdir(dirPath);
    }

    isDirCreated = true;
  };
};

export default createDirectoryIfNotExistsCached;
