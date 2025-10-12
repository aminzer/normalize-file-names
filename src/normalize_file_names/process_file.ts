import { parse } from 'node:path';
import { log } from '../logger/index.js';
import { copyFile } from '../utils/index.js';

export default async function processFile({
  inputFilePath,
  outputFilePath,
  isDryRun,
}: {
  inputFilePath: string;
  outputFilePath: string;
  isDryRun: boolean;
}): Promise<void> {
  if (isDryRun) {
    log(`"${parse(inputFilePath).base}" -> "${parse(outputFilePath).base}"`);
    return;
  }

  await copyFile(inputFilePath, outputFilePath, {
    keepSeparateIfExists: true,
  });
}
