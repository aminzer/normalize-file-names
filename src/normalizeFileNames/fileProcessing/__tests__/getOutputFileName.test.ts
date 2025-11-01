import assert from 'node:assert';
import { describe, it } from 'node:test';
import getOutputFileName from '../getOutputFileName.js';

const defaultOutputFileNameFormat = 'yyyy_MM_dd__HH_mm_ss_SSS';

describe('getOutputFileName', () => {
  describe("when file name doesn't contain extension", () => {
    it('returns filename containing creation time in expected format', () => {
      const inputFileName = 'test';
      const creationTime = new Date('2001-02-03 04:05:06');
      const outputFileNameFormat = defaultOutputFileNameFormat;

      const expectedFileName = '2001_02_03__04_05_06_000';

      assert.strictEqual(
        getOutputFileName({ inputFileName, creationTime, outputFileNameFormat }),
        expectedFileName,
      );
    });
  });

  describe('when file name contains extension', () => {
    it('returns filename containing creation time in expected format', () => {
      const inputFileName = 'test.jpg';
      const creationTime = new Date('2001-02-03 04:05:06');
      const outputFileNameFormat = defaultOutputFileNameFormat;

      const expectedFileName = '2001_02_03__04_05_06_000.jpg';

      assert.strictEqual(
        getOutputFileName({ inputFileName, creationTime, outputFileNameFormat }),
        expectedFileName,
      );
    });
  });

  describe('when file extension is in upper case', () => {
    it('converts extension to lower case', () => {
      const inputFileName = 'test.JPG';
      const creationTime = new Date('2001-02-03 04:05:06');
      const outputFileNameFormat = defaultOutputFileNameFormat;

      const expectedFileName = '2001_02_03__04_05_06_000.jpg';

      assert.strictEqual(
        getOutputFileName({ inputFileName, creationTime, outputFileNameFormat }),
        expectedFileName,
      );
    });
  });

  describe('when custom format is passed', () => {
    it('returns output file name in expected format', () => {
      const inputFileName = 'test.JPG';
      const creationTime = new Date('2001-02-03 04:05:06');
      const outputFileNameFormat = 'yyyyMMdd_HHmmss';

      const expectedFileName = '20010203_040506.jpg';

      assert.strictEqual(
        getOutputFileName({ inputFileName, creationTime, outputFileNameFormat }),
        expectedFileName,
      );
    });
  });
});
