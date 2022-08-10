import { promises as fs } from 'fs';
import isDirExist from './is_dir_exist';

export default function ensureDirExistsCached(dirPath: string) : () => Promise<void> {
  let isDirCreated = false;

  return async (): Promise<void> => {
    if (isDirCreated) {
      return;
    }

    if (!await isDirExist(dirPath)) {
      await fs.mkdir(dirPath);
    }

    isDirCreated = true;
  };
}
