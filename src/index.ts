import * as path from 'path';
import { iterateDirectoryChildren } from '@aminzer/dir-diff';
import { inputDirPath, outputDirPath, unrecognizedFilesOutputDirPath } from './config';
import { log } from './logger';
import { recognizeCreationTime } from './utils/file_naming';
import { getFileCount, copyFile } from './utils/fs';

(async () => {
  try {
    const totalFileCount = await getFileCount(inputDirPath);
    log(`Total file count: ${totalFileCount}`);

    await iterateDirectoryChildren(inputDirPath, async (fsEntry) => {
      if (fsEntry.isDirectory) {
        return;
      }

      const creationTime = recognizeCreationTime(fsEntry.absolutePath);

      if (creationTime === null) {
        const outputFilePath = path.join(unrecognizedFilesOutputDirPath, fsEntry.name);
        await copyFile(fsEntry.absolutePath, outputFilePath);
        return;
      }

      log(`${fsEntry.name} -> ${creationTime}`);

      const outputFilePath = path.join(outputDirPath, fsEntry.name);

      log(outputFilePath);

      await copyFile(fsEntry.absolutePath, outputFilePath);
    });
  } catch (err) {
    log(err);
  }
})();
