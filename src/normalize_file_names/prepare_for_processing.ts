import { log } from '../logger';
import { ensureDirExists } from '../utils';
import validateArgs from './validate_args';

export default async function prepareForProcessing({
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string,
  outputDirPath: string,
  unrecognizedFilesOutputDirPath: string,
  fetchCreationTimeFromFsForUnrecognizedFiles: boolean,
  isDryRun: boolean,
}):Promise<void> {
  await validateArgs({ inputDirPath, outputDirPath });

  if (!isDryRun) {
    await ensureDirExists(unrecognizedFilesOutputDirPath);
  }

  log(`Input dir: "${inputDirPath}"`);
  log(`Output dir: "${outputDirPath}"`);
  if (isDryRun) {
    log("! This is dry run: files won't be copied to the output dir");
  }
  if (fetchCreationTimeFromFsForUnrecognizedFiles) {
    log('! For unrecognized file names creation time will be fetched from FS attributes');
  }
  log();
}
