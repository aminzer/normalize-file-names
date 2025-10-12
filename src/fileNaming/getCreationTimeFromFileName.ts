import { parse } from 'node:path';
import timeParsers from './fileNameParsers/index.js';

const getCreationTimeFromFileName = (fileName: string): Date | null => {
  const { name } = parse(fileName);

  for (let i = 0; i < timeParsers.length; i += 1) {
    const creationTime = timeParsers[i](name);

    if (creationTime instanceof Date && !isNaN(creationTime.getTime())) {
      return creationTime;
    }
  }

  return null;
};

export default getCreationTimeFromFileName;
