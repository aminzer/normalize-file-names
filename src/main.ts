import configDefaults from './config/defaults.js';
import { StdoutLogger } from './logging/index.js';
import normalizeFileNames from './normalizeFileNames/index.js';

const inputDirPath = process.env.INPUT_DIR_PATH ?? '';

const outputDirPath = process.env.OUTPUT_DIR_PATH ?? '';

const outputFileNameFormat =
  process.env.OUTPUT_FILE_NAME_FORMAT ?? configDefaults.outputFileNameFormat;

const isFileSystemMetadataFallbackEnabled =
  typeof process.env.FS_METADATA_FALLBACK === 'string'
    ? process.env.FS_METADATA_FALLBACK === 'true'
    : configDefaults.isFileSystemMetadataFallbackEnabled;

const isDryRun =
  typeof process.env.DRY_RUN === 'string'
    ? process.env.DRY_RUN === 'true'
    : configDefaults.isDryRun;

const logger = new StdoutLogger();

try {
  await normalizeFileNames({
    inputDirPath,
    outputDirPath,
    outputFileNameFormat,
    isFileSystemMetadataFallbackEnabled,
    isDryRun,
    logger,
  });
} catch (err) {
  if (err instanceof Error) {
    logger.log(`Error: ${err.message}`);
  } else {
    logger.log(`Unknown error: ${err}`);
  }
}
