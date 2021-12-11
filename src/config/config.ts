import * as dotenv from 'dotenv';

dotenv.config();

const {
  INPUT_DIR_PATH,
  OUTPUT_DIR_PATH,
  IS_DRY_RUN,
  FETCH_CREATION_TIME_FROM_FS_FOR_UNRECOGNIZED_FILES,
} = process.env;

export const inputDirPath = INPUT_DIR_PATH;

export const outputDirPath = OUTPUT_DIR_PATH;

export const isDryRun = IS_DRY_RUN === 'true';

export const fetchCreationTimeFromFsForUnrecognizedFiles = FETCH_CREATION_TIME_FROM_FS_FOR_UNRECOGNIZED_FILES === 'true';
