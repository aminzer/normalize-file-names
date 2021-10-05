import { isDirExist } from '../utils/fs';
import { inputDirPath, outputDirPath } from './config';

export default async function validateConfig(): Promise<void> {
  if (!inputDirPath) {
    throw new Error('Input dir path not set');
  }

  if (!await isDirExist(inputDirPath)) {
    throw new Error(`Input dir path "${inputDirPath}" doesn't exist`);
  }

  if (!outputDirPath) {
    throw new Error('Output dir path not set');
  }

  if (!await isDirExist(outputDirPath)) {
    throw new Error(`Output dir path "${outputDirPath}" doesn't exist`);
  }
}
