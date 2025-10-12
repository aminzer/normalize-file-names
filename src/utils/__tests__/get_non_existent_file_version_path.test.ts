import assert from 'node:assert';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import getNonExistentFileVersionPath from '../get_non_existent_file_version_path.js';

function getResourcePath(name: string): string {
  return resolve(import.meta.dirname, '../../../test/resources/get_non_existent_file_path', name);
}

describe('getNonExistentFileVersionPath', () => {
  describe("when file doesn't exist", () => {
    it('returns the file path', async () => {
      const filePath = getResourcePath('non_existing_file.txt');

      assert.strictEqual(await getNonExistentFileVersionPath(filePath), filePath);
    });
  });

  describe('when file exists', () => {
    it('returns file path with number postfix', async () => {
      const filePath = getResourcePath('existing_file.txt');

      assert.strictEqual(
        await getNonExistentFileVersionPath(filePath),
        getResourcePath('existing_file__1.txt'),
      );
    });
  });

  describe('when both file and file with postfix exist', () => {
    it('returns file path with next available number postfix', async () => {
      const filePath = getResourcePath('existing_file_with_postfix.txt');

      assert.strictEqual(
        await getNonExistentFileVersionPath(filePath),
        getResourcePath('existing_file_with_postfix__2.txt'),
      );
    });
  });
});
