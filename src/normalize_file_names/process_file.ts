import * as path from 'path';
import { log } from '../logger';
import { copyFile } from '../utils';

export default async function processFile({
  inputFilePath,
  outputFilePath,
  isDryRun,
}: {
  inputFilePath: string,
  outputFilePath: string,
  isDryRun: boolean,
}): Promise<void> {
  if (isDryRun) {
    log(`"${path.parse(inputFilePath).base}" -> "${path.parse(outputFilePath).base}"`);
    return;
  }

  await copyFile(inputFilePath, outputFilePath, {
    keepSeparateIfExists: true,
  });
}
