import { parse } from 'node:path';
import { format } from 'date-fns';

const TIME_FORMAT = 'yyyyMMdd_HHmmssSSS';

const getOutputFileName = (inputFileName: string, creationTime: number): string => {
  const { ext } = parse(inputFileName);
  const formattedCreationTime = format(creationTime, TIME_FORMAT);

  return `${formattedCreationTime}${ext.toLowerCase()}`;
};

export default getOutputFileName;
