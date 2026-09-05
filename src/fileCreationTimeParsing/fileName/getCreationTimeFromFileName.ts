import { parse } from 'node:path';
import { SyncFileCreationTimeParser } from '../types.js';
import parsers from './parsers.js';

const getCreationTimeFromFileName: SyncFileCreationTimeParser = (filePath) => {
  const { name } = parse(filePath);

  for (let i = 0; i < parsers.length; i += 1) {
    const creationTime = parsers[i](name);

    if (creationTime) {
      return creationTime;
    }
  }

  return null;
};

export default getCreationTimeFromFileName;
