import { log } from './logger';
import {
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
} from './config';
import normalizeFileNames from './normalize_file_names';

(async () => {
  try {
    await normalizeFileNames({
      inputDirPath,
      outputDirPath,
      unrecognizedFilesOutputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
    });
  } catch (err) {
    log(err);
  }
})();
