import * as path from 'path';
import * as dotenv from 'dotenv';

// TODO ensure all paths are set

dotenv.config();

const {
  INPUT_DIR_PATH,
  OUTPUT_DIR_PATH,
  UNRECOGNIZED_FILES_OUTPUT_DIR_NAME,
} = process.env;

if (!INPUT_DIR_PATH) {
  throw new Error('INPUT_DIR_PATH not set');
}
if (!OUTPUT_DIR_PATH) {
  throw new Error('OUTPUT_DIR_PATH not set');
}
if (!UNRECOGNIZED_FILES_OUTPUT_DIR_NAME) {
  throw new Error('UNRECOGNIZED_FILES_OUTPUT_DIR_NAME not set');
}

// TODO ensure paths exists
// TODO create unrecon dir if not exists

export const inputDirPath = INPUT_DIR_PATH;

export const outputDirPath = OUTPUT_DIR_PATH;

export const unrecognizedFilesOutputDirPath = path.join(
  outputDirPath,
  UNRECOGNIZED_FILES_OUTPUT_DIR_NAME,
);
