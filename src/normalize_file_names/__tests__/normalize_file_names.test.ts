import assert from 'node:assert';
import { join, parse as parseFs, resolve } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { parse, isValid } from 'date-fns';
import {
  createDir,
  createFile,
  deleteDir,
  getDirNames,
  getFileNames,
  sleep,
} from './utils/index.js';
import normalizeFileNames from '../normalize_file_names.js';

function getResourcePath(name: string): string {
  return resolve(import.meta.dirname, '../../../test/resources/normalize_file_names', name);
}

describe('normalizeFileNames', () => {
  const inputDirPath = getResourcePath('input');
  const outputDirPath = getResourcePath('output');

  beforeEach(async () => {
    await createDir(inputDirPath);
    await createDir(outputDirPath);
  });

  afterEach(async () => {
    await deleteDir(inputDirPath);
    await deleteDir(outputDirPath);
  });

  describe('when "inputDirPath" isn\'t set', () => {
    it('rejects with error', async () => {
      await assert.rejects(() => normalizeFileNames({ inputDirPath: '', outputDirPath }), {
        message: 'Input dir path not set',
      });
    });
  });

  describe('when "inputDirPath" doesn\'t exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('rejects with error', async () => {
      await assert.rejects(() => normalizeFileNames({ inputDirPath: invalidPath, outputDirPath }), {
        message: `Input dir path "${invalidPath}" doesn't exist`,
      });
    });
  });

  describe('when "outputDirPath" isn\'t set', () => {
    it('rejects with error', async () => {
      await assert.rejects(() => normalizeFileNames({ inputDirPath, outputDirPath: '' }), {
        message: 'Output dir path not set',
      });
    });
  });

  describe('when "outputDirPath" doesn\'t exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('rejects with error', async () => {
      await assert.rejects(() => normalizeFileNames({ inputDirPath, outputDirPath: invalidPath }), {
        message: `Output dir path "${invalidPath}" doesn't exist`,
      });
    });
  });

  describe('when all args are valid', () => {
    describe('input directory contains both recognizable and unrecognizable files', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506_2.txt'));
        await createFile(getResourcePath('input/unrecognizable_file.txt'));

        await sleep(50);

        await createDir(getResourcePath('input/sub_dir_1'));
        await createFile(getResourcePath('input/sub_dir_1/file_20020304_050607.txt'));
        await createFile(getResourcePath('input/sub_dir_1/2021.12.26.txt'));
        await createFile(getResourcePath('input/sub_dir_1/unrecognizable_file_a.txt'));

        await sleep(50);

        await createDir(getResourcePath('input/sub_dir_2'));
        await createFile(getResourcePath('input/sub_dir_2/file_20030405_060708.txt'));

        await sleep(50);

        await createDir(getResourcePath('input/sub_dir_2/sub_dir_2_1'));
        await createFile(getResourcePath('input/sub_dir_2/sub_dir_2_1/unrecognizable_file_b.txt'));
      });

      describe('when only required args are set', () => {
        beforeEach(async () => {
          await normalizeFileNames({ inputDirPath, outputDirPath });
        });

        it('copies all recognized files into output directory with normalized names', async () => {
          const recognizedFileNames = await getFileNames(outputDirPath);

          assert.deepStrictEqual(recognizedFileNames, [
            '20010203_040506000.txt',
            '20020304_050607000.txt',
            '20030405_060708000.txt',
            '20211226_000000000.txt',
          ]);
        });

        it('creates separate directory for unrecognized files', async () => {
          const dirNames = await getDirNames(getResourcePath(outputDirPath));

          assert.deepStrictEqual(dirNames, ['_UNRECOGNIZED']);
        });

        it('copies unrecognized files to separate directory with original names', async () => {
          const unrecognizedFileNames = await getFileNames(getResourcePath('output/_UNRECOGNIZED'));

          assert.deepStrictEqual(unrecognizedFileNames, [
            'unrecognizable_file.txt',
            'unrecognizable_file_a.txt',
            'unrecognizable_file_b.txt',
          ]);
        });
      });

      describe('when "isDryRun" is set to "true"', () => {
        beforeEach(async () => {
          await normalizeFileNames({
            inputDirPath,
            outputDirPath,
            isDryRun: true,
          });
        });

        it("doesn't copy files to the output directory", async () => {
          const recognizedFileNames = await getFileNames(outputDirPath);

          assert.deepStrictEqual(recognizedFileNames, []);
        });

        it("doesn't creates separate directory for unrecognized files", async () => {
          const dirNames = await getDirNames(getResourcePath(outputDirPath));

          assert.deepStrictEqual(dirNames, []);
        });
      });

      describe('when "fetchCreationTimeFromFsForUnrecognizedFiles" is set to "true"', () => {
        beforeEach(async () => {
          await normalizeFileNames({
            inputDirPath,
            outputDirPath,
            fetchCreationTimeFromFsForUnrecognizedFiles: true,
          });
        });

        it('moves unrecognized files to separate directory with names fetched from file stats', async () => {
          const unrecognizedFileNames = await getFileNames(
            getResourcePath('output/_RECOGNIZED_FROM_FS'),
          );

          const areAllFilesHaveExpectedNames = unrecognizedFileNames.every((fileName) => {
            const { name } = parseFs(fileName);
            const date = parse(name, 'yyyyMMdd_HHmmssSSS', new Date(0));

            return isValid(date);
          });

          assert.strictEqual(areAllFilesHaveExpectedNames, true);
        });
      });
    });

    describe('when input directory contains few recognizable files with the same creation date', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506.txt'));
        await createFile(getResourcePath('input/file-20010203-040506.txt'));
        await createFile(getResourcePath('input/file_2001_02_03-04_05_06.txt'));

        await normalizeFileNames({ inputDirPath, outputDirPath });
      });

      it('copies these files with the same creation time but different postfixes', async () => {
        const fileNames = await getFileNames(getResourcePath('output'));

        assert.deepStrictEqual(fileNames, [
          '20010203_040506000.txt',
          '20010203_040506000__1.txt',
          '20010203_040506000__2.txt',
        ]);
      });
    });

    describe('when input dir contains recognizable files only', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506.txt'));

        await normalizeFileNames({ inputDirPath, outputDirPath });
      });

      it("doesn't crete folder for unrecognized files", async () => {
        const dirNames = await getDirNames(getResourcePath(outputDirPath));

        assert.deepStrictEqual(dirNames, []);
      });
    });
  });
});
