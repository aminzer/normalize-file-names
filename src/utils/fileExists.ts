import { stat } from 'node:fs/promises';

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
};

export default fileExists;
