import { parse } from 'node:path';
import { isValid } from 'date-fns';
import parsers from './parsers.js';
import { SyncFileCreationTimeParser } from '../types.js';

const getCreationTimeFromFileName: SyncFileCreationTimeParser = (filePath) => {
  const { name } = parse(filePath);

  for (let i = 0; i < parsers.length; i += 1) {
    const creationTime = parsers[i](name);

    if (isValid(creationTime)) {
      return creationTime;
    }
  }

  return null;
};

export default getCreationTimeFromFileName;
