import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { log } from './logger';
import {
  getCreationTimeFromFileName,
  getOutputFileName,
} from './utils/file_naming';
import {
  inputDirPath,
  outputDirPath,
  unrecognizedFilesOutputDirPath,
  validateConfig,
} from './config';
import {
  ensureDirExists,
  getFileCount,
  getCreationTimeFromFs,
  copyFile,
} from './utils/fs';

async function processFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
  await copyFile(sourceFilePath, targetFilePath, {
    keepSeparateIfExists: true,
  });
}

(async () => {
  try {
    await validateConfig();

    await ensureDirExists(unrecognizedFilesOutputDirPath);

    const totalFileCount = await getFileCount(inputDirPath);
    log(`Total file count: ${totalFileCount}`);

    await iterateDirectoryChildren(inputDirPath, async (fsEntry) => {
      if (fsEntry.isDirectory) {
        return;
      }

      const creationTimeFromFileName = getCreationTimeFromFileName(fsEntry.name);

      if (creationTimeFromFileName !== null) {
        const outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFileName);
        const outputFilePath = path.join(outputDirPath, outputFileName);

        await processFile(fsEntry.absolutePath, outputFilePath);
        return;
      }

      const creationTimeFromFs = await getCreationTimeFromFs(fsEntry.absolutePath);
      const outputFileName = getOutputFileName(fsEntry.name, creationTimeFromFs);
      const outputFilePath = path.join(unrecognizedFilesOutputDirPath, outputFileName);

      await processFile(fsEntry.absolutePath, outputFilePath);
    });

    log('Done');
  } catch (err) {
    log(err);
  }
})();
