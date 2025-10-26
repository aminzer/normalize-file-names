import { parse } from 'node:path';
import { format } from 'date-fns';

const TIME_FORMAT = 'yyyy_MM_dd__HH_mm_ss_SSS';

const getOutputFileName = (inputFileName: string, creationTime: Date): string => {
  const { ext } = parse(inputFileName);
  const formattedCreationTime = format(creationTime, TIME_FORMAT);

  return `${formattedCreationTime}${ext.toLowerCase()}`;
};

export default getOutputFileName;
