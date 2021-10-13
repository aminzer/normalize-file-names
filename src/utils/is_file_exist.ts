import { promises as fs } from 'fs';

export default async function isFileExist(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}
