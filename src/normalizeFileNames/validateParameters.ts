import { directoryExists } from '@aminzer/traverse-directory';

const validateParameters = async ({
  inputDirPath,
  outputDirPath,
}: {
  inputDirPath: string;
  outputDirPath: string;
}): Promise<void> => {
  if (!inputDirPath) {
    throw new Error('Input directory path not set');
  }

  if (!(await directoryExists(inputDirPath))) {
    throw new Error(`Input directory path "${inputDirPath}" doesn't exist`);
  }

  if (!outputDirPath) {
    throw new Error('Output directory path not set');
  }

  if (!(await directoryExists(outputDirPath))) {
    throw new Error(`Output directory path "${outputDirPath}" doesn't exist`);
  }
};

export default validateParameters;
