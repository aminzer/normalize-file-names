import { stat } from 'node:fs/promises';

const getCreationTimeFromFs = async (filePath: string): Promise<Date> => {
  const { birthtime, mtime } = await stat(filePath);

  return new Date(Math.min(birthtime.valueOf(), mtime.valueOf()));
};

export default getCreationTimeFromFs;
