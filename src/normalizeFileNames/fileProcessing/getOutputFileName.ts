import { parse } from 'node:path';
import { format } from 'date-fns';

const getOutputFileName = ({
  inputFileName,
  creationTime,
  outputFileNameFormat,
}: {
  inputFileName: string;
  creationTime: Date;
  outputFileNameFormat: string;
}): string => {
  const { ext } = parse(inputFileName);

  const baseFileName = format(creationTime, outputFileNameFormat);

  return `${baseFileName}${ext.toLowerCase()}`;
};

export default getOutputFileName;
