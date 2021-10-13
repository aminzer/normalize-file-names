import { promises as fs } from 'fs';
import isDirExist from './is_dir_exist';

export default async function ensureDirExists(dirPath: string): Promise<void> {
  if (!await isDirExist(dirPath)) {
    await fs.mkdir(dirPath);
  }
}
