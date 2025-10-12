import assert from 'node:assert';
import { describe, it } from 'node:test';
import getCreationTimeFromFileName from '../getCreationTimeFromFileName.js';

interface TestCase {
  input: string;
  expectedOutput: number;
}

const recognizableCases: TestCase[] = [
  '20010203040506',
  'IMG_20010203040506',
  'IMG_20010203040506_1',
  'IMG_20010203_040506',
  'IMG_20010203_040506_1',
  'IMG-20010203-040506',
  'IMG.20010203.040506',
  'IMG 20010203 040506',
  '2001_02_03_04_05_06',
  'IMG_2001_02_03_04_05_06',
  'IMG_2001_02_03_04_05_06_1',
  'IMG_2001-02-03_04-05-06',
  'IMG 2001 02 03 04 05 06',
  'IMG-2001.02.03-04.05.06',
  'some-text-here-2001-02-03-04-05-06',
  '20010203_040506',
].map((input) => ({
  input,
  expectedOutput: new Date('2001-02-03 04:05:06').valueOf(),
}));

recognizableCases.push(
  ...['2001 02 03', '2001.02.03', '2001_02_03', '2001-02-03'].map((input) => ({
    input,
    expectedOutput: new Date('2001-02-03 00:00:00').valueOf(),
  })),
);

recognizableCases.push(
  {
    input: '1600000000000',
    expectedOutput: new Date(1600000000000).valueOf(),
  },
  {
    input: 'IMG_2001_02_03_04_05_06_007',
    expectedOutput: new Date('2001-02-03 04:05:06.007').valueOf(),
  },
  {
    input: '2021.12.26',
    expectedOutput: new Date('2021.12.26 00:00:00').valueOf(),
  },
  {
    input: '20220417_200000',
    expectedOutput: new Date('2022.04.17 20:00:00').valueOf(),
  },
);

describe('getCreationTimeFromFileName', () => {
  describe("when file name doesn't contain recognizable time", () => {
    const unrecognizableFilenames = ['no-time-here-123.jpg', '200089800743_138740.jpg'];

    unrecognizableFilenames.forEach((fileName) => {
      describe(`when file name is "${fileName}"`, () => {
        it('returns null', () => {
          assert.strictEqual(getCreationTimeFromFileName(fileName), null);
        });
      });
    });
  });

  describe('when file name contains recognizable time', () => {
    recognizableCases.forEach(({ input, expectedOutput }) => {
      const fileName = `${input}.jpg`;

      describe(`when file name is "${fileName}"`, () => {
        it(`returns timestamp of ${expectedOutput}`, () => {
          const expectedTime = new Date(expectedOutput).valueOf();

          assert.strictEqual(getCreationTimeFromFileName(fileName), expectedTime);
        });
      });
    });
  });
});
