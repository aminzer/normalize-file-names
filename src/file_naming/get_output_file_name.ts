import * as path from 'path';
import { format } from 'date-fns';

const TIME_FORMAT = 'yyyy.MM.dd_HH.mm.ss.SSS';

export default function getOutputFileName(inputFileName: string, creationTime: number): string {
  const { ext } = path.parse(inputFileName);
  const formattedCreationTime = format(creationTime, TIME_FORMAT);

  return `${formattedCreationTime}${ext.toLowerCase()}`;
}
