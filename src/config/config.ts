import { config } from 'dotenv';

config();

export const inputDirPath = process.env.INPUT_DIR_PATH ?? '';

export const outputDirPath = process.env.OUTPUT_DIR_PATH ?? '';

export const outputFileNameFormat =
  process.env.OUTPUT_FILE_NAME_FORMAT ?? 'yyyy_MM_dd__HH_mm_ss_SSS';

export const isDryRun = process.env.DRY_RUN === 'true';

export const isFileSystemMetadataFallbackEnabled = process.env.FS_METADATA_FALLBACK === 'true';
