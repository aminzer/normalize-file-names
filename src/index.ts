import {
  inputDirPath,
  outputDirPath,
  outputFileNameFormat,
  isFileSystemMetadataFallbackEnabled,
  isDryRun,
} from './config/index.js';
import { StdoutLogger } from './logging/index.js';
import main from './main.js';

const logger = new StdoutLogger();

main({
  inputDirPath,
  outputDirPath,
  outputFileNameFormat,
  isFileSystemMetadataFallbackEnabled,
  isDryRun,
  logger,
});
