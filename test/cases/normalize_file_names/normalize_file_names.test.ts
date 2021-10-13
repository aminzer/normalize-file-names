import * as fs from 'fs/promises';
import * as path from 'path';
import { parse, isValid } from 'date-fns';
import {
  createDir, createFile, deleteDir, getDirNames, getFileNames, sleep,
} from '../../utils';
import normalizeFileNames from '../../../dist/normalize_file_names';

function getResourcePath(fileName: string): string {
  return path.resolve(__dirname, '../../resources/normalize_file_names', fileName);
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
      await expect(normalizeFileNames({
        inputDirPath: undefined as any,
        outputDirPath,
      }))
        .rejects
        .toThrow('Input dir path not set');
    });
  });

  describe('when "inputDirPath" doesn\'t exist', () => {
    const invalidPath = path.join(__dirname, 'invalid/path');

    it('rejects with error', async () => {
      await expect(normalizeFileNames({
        inputDirPath: invalidPath,
        outputDirPath,
      }))
        .rejects
        .toThrow(`Input dir path "${invalidPath}" doesn't exist`);
    });
  });

  describe('when "outputDirPath" isn\'t set', () => {
    it('rejects with error', async () => {
      await expect(normalizeFileNames({
        inputDirPath,
        outputDirPath: undefined as any,
      }))
        .rejects
        .toThrow('Output dir path not set');
    });
  });

  describe('when "outputDirPath" doesn\'t exist', () => {
    const invalidPath = path.join(__dirname, 'invalid/path');

    it('rejects with error', async () => {
      await expect(normalizeFileNames({
        inputDirPath,
        outputDirPath: invalidPath,
      }))
        .rejects
        .toThrow(`Output dir path "${invalidPath}" doesn't exist`);
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
        await createFile(getResourcePath('input/sub_dir_1/unrecognizable_file_a.txt'));

        await sleep(50);

        await createDir(getResourcePath('input/sub_dir_2'));
        await createFile(getResourcePath('input/sub_dir_2/file_20030405_060708.txt'));
        await createFile(getResourcePath('input/sub_dir_2/unrecognizable_file_b.txt'));
      });

      describe('when only required args are set', () => {
        beforeEach(async () => {
          await normalizeFileNames({
            inputDirPath,
            outputDirPath,
          });
        });

        it('copies all recognized files into output directory with normalized names', async () => {
          const recognizedFileNames = await getFileNames(outputDirPath);

          expect(recognizedFileNames).toEqual([
            '2001.02.03_04.05.06.000.txt',
            '2002.03.04_05.06.07.000.txt',
            '2003.04.05_06.07.08.000.txt',
          ]);
        });

        it('creates separate directory for unrecognized files', async () => {
          const dirNames = await getDirNames(getResourcePath(outputDirPath));

          expect(dirNames).toEqual([
            '_UNRECOGNIZED',
          ]);
        });

        it('moves unrecognized files to separate directory with original names', async () => {
          const unrecognizedFileNames = await getFileNames(getResourcePath('output/_UNRECOGNIZED'));

          expect(unrecognizedFileNames).toEqual([
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

          expect(recognizedFileNames).toEqual([]);
        });

        it("doesn't creates separate directory for unrecognized files", async () => {
          const dirNames = await getDirNames(getResourcePath(outputDirPath));

          expect(dirNames).toEqual([]);
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
          const unrecognizedFileNames = await getFileNames(getResourcePath('output/_UNRECOGNIZED'));

          const areAllFilesHaveExpectedNames = unrecognizedFileNames.every((fileName) => {
            const { name } = path.parse(fileName);
            const date = parse(name, 'yyyy.MM.dd_HH.mm.ss.SSS', new Date(0));

            return isValid(date);
          });

          expect(areAllFilesHaveExpectedNames).toBe(true);
        });
      });
    });

    describe('when input directory contains few recognizable files with the same creation date', () => {
      beforeEach(async () => {
        await createFile(getResourcePath('input/file_20010203_040506.txt'));
        await createFile(getResourcePath('input/file-20010203-040506.txt'));
        await createFile(getResourcePath('input/file_2001_02_03-04_05_06.txt'));

        await normalizeFileNames({
          inputDirPath,
          outputDirPath,
        });
      });

      it('copies these files with the same creation time but different postfixes', async () => {
        const fileNames = await getFileNames(getResourcePath('output'));

        expect(fileNames).toEqual([
          '2001.02.03_04.05.06.000.txt',
          '2001.02.03_04.05.06.000_1.txt',
          '2001.02.03_04.05.06.000_2.txt',
        ]);
      });
    });
  });
});
