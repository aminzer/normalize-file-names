import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const inputDirPath = process.env.INPUT_DIR_PATH;

export const outputDirPath = process.env.OUTPUT_DIR_PATH;

export const unrecognizedFilesOutputDirPath = path.join(outputDirPath || '', '_UNRECOGNIZED');

export const fetchCreationTimeFromFsForUnrecognizedFiles = process.env.FETCH_CREATION_TIME_FROM_FS_FOR_UNRECOGNIZED_FILES === 'true';
