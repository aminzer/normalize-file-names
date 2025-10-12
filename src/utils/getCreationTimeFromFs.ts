import { stat } from 'node:fs/promises';

const getCreationTimeFromFs = async (filePath: string): Promise<number> => {
  const { birthtime, mtime } = await stat(filePath);

  return Math.min(birthtime.valueOf(), mtime.valueOf());
};

export default getCreationTimeFromFs;
