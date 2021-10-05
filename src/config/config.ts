import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const inputDirPath = process.env.INPUT_DIR_PATH;

export const outputDirPath = process.env.OUTPUT_DIR_PATH;

export const unrecognizedFilesOutputDirPath = path.join(outputDirPath || '', '_UNRECOGNIZED');
