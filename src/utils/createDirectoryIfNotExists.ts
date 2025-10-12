import { mkdir } from 'node:fs/promises';
import { directoryExists } from '@aminzer/traverse-directory';

const createDirectoryIfNotExists = async (dirPath: string): Promise<void> => {
  if (await directoryExists(dirPath)) {
    return;
  }

  await mkdir(dirPath);
};

export default createDirectoryIfNotExists;
