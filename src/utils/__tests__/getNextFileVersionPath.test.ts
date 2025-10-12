import assert from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import getNextFileVersionPath from '../getNextFileVersionPath.js';

describe('getNextFileVersionPath', () => {
  describe("when file doesn't have postfix", () => {
    it('returns the file path', async () => {
      const filePath = join('path', 'to', 'file.txt');

      assert.strictEqual(getNextFileVersionPath(filePath), join('path', 'to', 'file__1.txt'));
    });
  });

  describe('when file has postfix "__1"', () => {
    it('returns the file path', async () => {
      const filePath = join('path', 'to', 'file__1.txt');

      assert.strictEqual(getNextFileVersionPath(filePath), join('path', 'to', 'file__2.txt'));
    });
  });

  describe('when file has postfix "__2"', () => {
    it('returns the file path', async () => {
      const filePath = join('path', 'to', 'file__2.txt');

      assert.strictEqual(getNextFileVersionPath(filePath), join('path', 'to', 'file__3.txt'));
    });
  });
});
