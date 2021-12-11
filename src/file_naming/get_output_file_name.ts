import * as path from 'path';
import { format } from 'date-fns';

const TIME_FORMAT = 'yyyyMMdd_HHmmssSSS';

export default function getOutputFileName(inputFileName: string, creationTime: number): string {
  const { ext } = path.parse(inputFileName);
  const formattedCreationTime = format(creationTime, TIME_FORMAT);

  return `${formattedCreationTime}${ext.toLowerCase()}`;
}
