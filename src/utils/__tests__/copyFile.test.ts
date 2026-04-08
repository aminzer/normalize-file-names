import assert from 'node:assert';
import { readdir, rm, writeFile, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { describe, it, afterEach } from 'node:test';
import copyFile from '../copyFile.js';

const resourceDir = resolve(import.meta.dirname, '../../../test/resources/copy_file');
const sourceFilePath = join(resourceDir, 'source.txt');
const targetFilePath = join(resourceDir, 'target.txt');

describe('copyFile', () => {
  afterEach(async () => {
    const resourceDirEntries = await readdir(resourceDir);

    await Promise.all(
      resourceDirEntries
        .filter((entry) => entry !== '.gitkeep')
        .map((entry) => rm(join(resourceDir, entry))),
    );
  });

  describe('when target file does not exist', () => {
    it('copies the file', async () => {
      await writeFile(sourceFilePath, 'source content');

      await copyFile(sourceFilePath, targetFilePath);

      assert.strictEqual(await readFile(targetFilePath, 'utf-8'), 'source content');
    });
  });

  describe('when target file exists', () => {
    it('throws an error by default', async () => {
      await writeFile(sourceFilePath, 'source content');
      await writeFile(targetFilePath, 'target content');

      await assert.rejects(() => copyFile(sourceFilePath, targetFilePath), {
        message: `File "${targetFilePath}" already exists"`,
      });
    });

    describe('with overwriteIfExists option', () => {
      it('overwrites the target file', async () => {
        await writeFile(sourceFilePath, 'source content');
        await writeFile(targetFilePath, 'target content');

        await copyFile(sourceFilePath, targetFilePath, { overwriteIfExists: true });

        assert.strictEqual(await readFile(targetFilePath, 'utf-8'), 'source content');
      });
    });

    describe('with saveAsNewFileVersionIfExists option', () => {
      it('copies to a versioned file path', async () => {
        await writeFile(sourceFilePath, 'source content');
        await writeFile(targetFilePath, 'target content');

        await copyFile(sourceFilePath, targetFilePath, { saveAsNewFileVersionIfExists: true });

        const versionedPath = join(resourceDir, 'target__1.txt');

        assert.strictEqual(await readFile(sourceFilePath, 'utf-8'), 'source content');
        assert.strictEqual(await readFile(targetFilePath, 'utf-8'), 'target content');
        assert.strictEqual(await readFile(versionedPath, 'utf-8'), 'source content');
      });
    });
  });
});
