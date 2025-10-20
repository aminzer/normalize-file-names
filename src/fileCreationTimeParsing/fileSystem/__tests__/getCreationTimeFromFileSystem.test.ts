import { strict as assert } from 'node:assert';
import { writeFile, utimes, unlink, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, it, beforeEach, afterEach } from 'node:test';
import getCreationTimeFromFileSystem from '../getCreationTimeFromFileSystem.js';

const testFilePath = resolve(import.meta.dirname, 'test-file.txt');

describe('getCreationTimeFromFileSystem', () => {
  beforeEach(async () => {
    await writeFile(testFilePath, 'test');
  });

  afterEach(async () => {
    await unlink(testFilePath);
  });

  describe('when file creation time is earlier than last modification time', () => {
    const lastModificationTime = new Date(Date.now() + 15 * 60 * 1000);

    beforeEach(async () => {
      await utimes(testFilePath, new Date(), lastModificationTime);
    });

    it('returns the file creation time', async () => {
      const creationTime = await getCreationTimeFromFileSystem(testFilePath);
      const expectedCreationTime = (await stat(testFilePath)).birthtime;

      assert.strictEqual(creationTime!.getTime(), expectedCreationTime.getTime());
    });
  });

  describe('when file creation time is later than last modification time', () => {
    const lastModificationTime = new Date(Date.now() - 15 * 60 * 1000);

    beforeEach(async () => {
      await utimes(testFilePath, new Date(), lastModificationTime);
    });

    it('returns the file last modification time', async () => {
      const creationTime = await getCreationTimeFromFileSystem(testFilePath);

      assert.strictEqual(creationTime!.getTime(), lastModificationTime.getTime());
    });
  });
});
