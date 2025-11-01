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
import normalizeFileNames from '../normalizeFileNames.js';
import TestLogger from './TestLogger.js';

const getResourcePath = (name: string): string => {
  return resolve(import.meta.dirname, '../../../test/resources/normalize_file_names', name);
};

const outputFileNameFormat = 'yyyy_MM_dd__HH_mm_ss_SSS';

describe('normalizeFileNames', () => {
  const logger = new TestLogger();

  const inputDirPath = getResourcePath('input');
  const outputDirPath = getResourcePath('output');

  beforeEach(async () => {
    logger.reset();

    await createDir(inputDirPath);
    await createDir(outputDirPath);
  });

  afterEach(async () => {
    await deleteDir(inputDirPath);
    await deleteDir(outputDirPath);
  });

  describe('when "inputDirPath" isn\'t set', () => {
    it('rejects with error', async () => {
      await assert.rejects(
        () => normalizeFileNames({ inputDirPath: '', outputDirPath, outputFileNameFormat, logger }),
        {
          message: 'Input directory path not set',
        },
      );
    });
  });

  describe('when "inputDirPath" doesn\'t exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('rejects with error', async () => {
      await assert.rejects(
        () =>
          normalizeFileNames({
            inputDirPath: invalidPath,
            outputDirPath,
            outputFileNameFormat,
            logger,
          }),
        {
          message: `Input directory path "${invalidPath}" doesn't exist`,
        },
      );
    });
  });

  describe('when "outputDirPath" isn\'t set', () => {
    it('rejects with error', async () => {
      await assert.rejects(
        () => normalizeFileNames({ inputDirPath, outputDirPath: '', outputFileNameFormat, logger }),
        {
          message: 'Output directory path not set',
        },
      );
    });
  });

  describe('when "outputDirPath" doesn\'t exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('rejects with error', async () => {
      await assert.rejects(
        () =>
          normalizeFileNames({
            inputDirPath,
            outputDirPath: invalidPath,
            outputFileNameFormat,
            logger,
          }),
        {
          message: `Output directory path "${invalidPath}" doesn't exist`,
        },
      );
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
          await normalizeFileNames({ inputDirPath, outputDirPath, outputFileNameFormat, logger });
        });

        it('copies all recognized files into output directory with normalized names', async () => {
          const recognizedFileNames = await getFileNames(outputDirPath);

          assert.deepStrictEqual(recognizedFileNames, [
            '2001_02_03__04_05_06_000.txt',
            '2002_03_04__05_06_07_000.txt',
            '2003_04_05__06_07_08_000.txt',
            '2021_12_26__00_00_00_000.txt',
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

        it('outputs the expected log messages', async () => {
          assert.deepStrictEqual(logger.getMessages(), [
            `Input directory: "${inputDirPath}"`,
            `Output directory: "${outputDirPath}"`,
            '',
            '',
            'Recognized files (from name): 4',
            'Unrecognized files: 3',
          ]);
        });
      });

      describe('when "isDryRun" is set to "true"', () => {
        beforeEach(async () => {
          await normalizeFileNames({
            inputDirPath,
            outputDirPath,
            outputFileNameFormat,
            isDryRun: true,
            logger,
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

        it('outputs the expected log messages', async () => {
          assert.deepStrictEqual(logger.getMessages(), [
            `Input directory: "${inputDirPath}"`,
            `Output directory: "${outputDirPath}"`,
            "! This is dry run: files won't be copied to the output directory",
            '',
            '"file_20010203_040506_2.txt" -> "2001_02_03__04_05_06_000.txt"',
            '"2021.12.26.txt" -> "2021_12_26__00_00_00_000.txt"',
            '"file_20020304_050607.txt" -> "2002_03_04__05_06_07_000.txt"',
            '"unrecognizable_file_a.txt" -> "unrecognizable_file_a.txt"',
            '"file_20030405_060708.txt" -> "2003_04_05__06_07_08_000.txt"',
            '"unrecognizable_file_b.txt" -> "unrecognizable_file_b.txt"',
            '"unrecognizable_file.txt" -> "unrecognizable_file.txt"',
            '',
            'Recognized files (from name): 4',
            'Unrecognized files: 3',
          ]);
        });
      });

      describe('when "isFileSystemMetadataFallbackEnabled" is set to "true"', () => {
        beforeEach(async () => {
          await normalizeFileNames({
            inputDirPath,
            outputDirPath,
            outputFileNameFormat,
            isFileSystemMetadataFallbackEnabled: true,
            logger,
          });
        });

        it('moves unrecognized files to separate directory with names fetched from file stats', async () => {
          const unrecognizedFileNames = await getFileNames(
            getResourcePath('output/_RECOGNIZED_FROM_FS'),
          );

          const areAllFilesHaveExpectedNames = unrecognizedFileNames.every((fileName) => {
            const { name } = parseFs(fileName);
            const date = parse(name, 'yyyy_MM_dd__HH_mm_ss_SSS', new Date(0));

            return isValid(date);
          });

          assert.strictEqual(areAllFilesHaveExpectedNames, true);
        });

        it('outputs the expected log messages', async () => {
          assert.deepStrictEqual(logger.getMessages(), [
            `Input directory: "${inputDirPath}"`,
            `Output directory: "${outputDirPath}"`,
            '! For unrecognized file names creation time will be fetched from file system file metadata',
            '',
            '',
            'Recognized files (from name): 4',
            'Recognized files (from FS timestamps): 4',
          ]);
        });
      });
    });

    describe('when input directory contains few recognizable files with the same creation date', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506.txt'));
        await createFile(getResourcePath('input/file-20010203-040506.txt'));
        await createFile(getResourcePath('input/file_2001_02_03-04_05_06.txt'));

        await normalizeFileNames({ inputDirPath, outputDirPath, outputFileNameFormat, logger });
      });

      it('copies these files with the same creation time but different postfixes', async () => {
        const fileNames = await getFileNames(getResourcePath('output'));

        assert.deepStrictEqual(fileNames, [
          '2001_02_03__04_05_06_000.txt',
          '2001_02_03__04_05_06_000__1.txt',
          '2001_02_03__04_05_06_000__2.txt',
        ]);
      });
    });

    describe('when input directory contains recognizable files only', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506.txt'));

        await normalizeFileNames({ inputDirPath, outputDirPath, outputFileNameFormat, logger });
      });

      it("doesn't crete folder for unrecognized files", async () => {
        const dirNames = await getDirNames(getResourcePath(outputDirPath));

        assert.deepStrictEqual(dirNames, []);
      });
    });
  });
});
