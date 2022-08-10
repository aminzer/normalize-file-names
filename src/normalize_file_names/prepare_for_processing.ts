import { log } from '../logger';
import validateArgs from './validate_args';

export default async function prepareForProcessing({
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles = false,
  isDryRun = false,
}: {
  inputDirPath: string,
  outputDirPath: string,
  fetchCreationTimeFromFsForUnrecognizedFiles: boolean,
  isDryRun: boolean,
}):Promise<void> {
  await validateArgs({ inputDirPath, outputDirPath });

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
