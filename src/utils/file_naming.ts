import * as path from 'path';
import { format } from 'date-fns';

export function getCreationTimeFromFileName(fileName: string): number {
  const { name } = path.parse(fileName);

  if (/^\d+$/.test(name)) {
    return +name;
  }

  return null;
}

export function getOutputFileName(inputFileName: string, creationTime: number): string {
  const { ext } = path.parse(inputFileName);
  const formattedCreationTime = format(creationTime, 'yyyyMMdd_HHmmssSSS');

  return `${formattedCreationTime}${ext}`;
}
