import { log } from './logger';
import {
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
} from './config';
import normalizeFileNames from './normalize_file_names';

(async () => {
  try {
    await normalizeFileNames({
      inputDirPath,
      outputDirPath,
      fetchCreationTimeFromFsForUnrecognizedFiles,
      isDryRun,
    });
  } catch (err) {
    log(err);
  }
})();
