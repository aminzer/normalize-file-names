import { config } from 'dotenv';

config();

export const inputDirPath = process.env.INPUT_DIR_PATH ?? '';

export const outputDirPath = process.env.OUTPUT_DIR_PATH ?? '';

export const isDryRun = process.env.DRY_RUN === 'true';

export const isFileSystemMetadataFallbackEnabled = process.env.FS_METADATA_FALLBACK === 'true';
