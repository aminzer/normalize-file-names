import * as path from 'path';

export function getFileExtension(fileName: string): string {
  return path.parse(fileName).ext;
}

export function getFileNameWithoutExtension(fileName: string): string {
  return path.parse(fileName).name;
}
