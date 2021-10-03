import { getFileNameWithoutExtension } from './path';

export function recognizeCreationTime(filePath: string): number {
  const fileNameWithoutExtension = getFileNameWithoutExtension(filePath);

  if (/^\d+$/.test(fileNameWithoutExtension)) {
    return Number.parseInt(fileNameWithoutExtension, 10);
  }

  return null;
}

export function getOutputFileName(): void {
  // TODO impl
}
