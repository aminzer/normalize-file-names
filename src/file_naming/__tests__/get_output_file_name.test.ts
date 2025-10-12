import assert from 'node:assert';
import { describe, it } from 'node:test';
import getOutputFileName from '../get_output_file_name.js';

const creationTime = new Date('2001-02-03 04:05:06').valueOf();
const formattedCreationTime = '20010203_040506000';

describe('getOutputFileName', () => {
  describe("when file name doesn't contain extension", () => {
    it('returns filename containing creation time in expected format', () => {
      const fileName = 'test';
      const expectedFileName = formattedCreationTime;

      assert.strictEqual(getOutputFileName(fileName, creationTime), expectedFileName);
    });
  });

  describe('when file name contains extension', () => {
    it('returns filename containing creation time in expected format', () => {
      const fileName = 'test.jpg';
      const expectedFileName = `${formattedCreationTime}.jpg`;

      assert.strictEqual(getOutputFileName(fileName, creationTime), expectedFileName);
    });
  });

  describe('when file extension is in upper case', () => {
    it('converts extension to lower case', () => {
      const fileName = 'test.JPG';
      const expectedFileName = `${formattedCreationTime}.jpg`;

      assert.strictEqual(getOutputFileName(fileName, creationTime), expectedFileName);
    });
  });
});
