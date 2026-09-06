import assert from 'node:assert';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import getNonExistentFileVersionPathCached from '../getNonExistentFileVersionPathCached.js';

const getResourcePath = (name: string): string => {
  return resolve(import.meta.dirname, '../../../test/resources/get_non_existent_file_path', name);
};

describe('getNonExistentFileVersionPathCached', () => {
  describe('when called for the same path multiple times', () => {
    it('returns the next version path on each call without waiting for files to be created', async () => {
      const getFileVersionPath = getNonExistentFileVersionPathCached();
      const filePath = getResourcePath('existing_file.txt');

      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('existing_file__1.txt'),
      );
      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('existing_file__2.txt'),
      );
      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('existing_file__3.txt'),
      );
    });
  });

  describe('when called for different paths', () => {
    it('tracks the versions of each path independently', async () => {
      const getFileVersionPath = getNonExistentFileVersionPathCached();
      const filePath = getResourcePath('existing_file.txt');
      const otherFilePath = getResourcePath('existing_file_with_postfix.txt');

      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('existing_file__1.txt'),
      );
      assert.strictEqual(
        await getFileVersionPath(otherFilePath),
        getResourcePath('existing_file_with_postfix__2.txt'),
      );
      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('existing_file__2.txt'),
      );
      assert.strictEqual(
        await getFileVersionPath(otherFilePath),
        getResourcePath('existing_file_with_postfix__3.txt'),
      );
    });
  });

  describe("when file doesn't exist", () => {
    it('returns the file path', async () => {
      const getFileVersionPath = getNonExistentFileVersionPathCached();
      const filePath = getResourcePath('non_existing_file.txt');

      assert.strictEqual(await getFileVersionPath(filePath), filePath);
      assert.strictEqual(
        await getFileVersionPath(filePath),
        getResourcePath('non_existing_file__1.txt'),
      );
    });
  });

  describe('when returned function is created again', () => {
    it("doesn't reuse the versions of the previously created function", async () => {
      const filePath = getResourcePath('existing_file.txt');

      assert.strictEqual(
        await getNonExistentFileVersionPathCached()(filePath),
        getResourcePath('existing_file__1.txt'),
      );
      assert.strictEqual(
        await getNonExistentFileVersionPathCached()(filePath),
        getResourcePath('existing_file__1.txt'),
      );
    });
  });
});
