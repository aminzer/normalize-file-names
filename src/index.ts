import {
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
} from './config/index.js';
import { StdoutLogger } from './logging/index.js';
import main from './main.js';

const logger = new StdoutLogger();

main({
  inputDirPath,
  outputDirPath,
  fetchCreationTimeFromFsForUnrecognizedFiles,
  isDryRun,
  logger,
});
