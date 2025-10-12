import { stat } from 'node:fs/promises';
import { AsyncFileCreationTimeParser } from '../types.js';

const getCreationTimeFromFileSystem: AsyncFileCreationTimeParser = async (
  filePath: string,
): Promise<Date> => {
  const { birthtime, mtime } = await stat(filePath);

  return new Date(Math.min(birthtime.valueOf(), mtime.valueOf()));
};

export default getCreationTimeFromFileSystem;
