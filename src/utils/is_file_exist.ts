import { stat } from 'node:fs/promises';

export default async function isFileExist(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}
