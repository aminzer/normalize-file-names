import { log } from './logger/index.js';
import {
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
} from './config/index.js';
import normalizeFileNames from './normalize_file_names/index.js';

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
