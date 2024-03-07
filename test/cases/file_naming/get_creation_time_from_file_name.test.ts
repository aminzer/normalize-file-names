import { getCreationTimeFromFileName } from '../../../src/file_naming';

type Case = {
  input: string;
  output: string | number;
};

const unrecognizableCases: Case[] = [
  'no-time-here-123.jpg',
  '200089800743_138740.jpg',
].map((input) => ({
  input,
  output: null,
}));

const recognizableCases: Case[] = [
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
].map((input) => ({
  input,
  output: '2001-02-03 04:05:06',
}));

recognizableCases.push({
  input: '1600000000000',
  output: new Date(1600000000000).valueOf(),
}, {
  input: 'IMG_2001_02_03_04_05_06_007',
  output: '2001-02-03 04:05:06.007',
});

describe('getCreationTimeFromFileName', () => {
  describe("when file name doesn't contain recognizable time", () => {
    unrecognizableCases.forEach(({ input }) => {
      const fileName = `${input}.jpg`;

      describe(`when file name is "${fileName}"`, () => {
        it('returns null', () => {
          expect(getCreationTimeFromFileName(fileName)).toBe(null);
        });
      });
    });
  });

  describe('when file name contains recognizable time', () => {
    recognizableCases.forEach(({ input, output }) => {
      const fileName = `${input}.jpg`;

      describe(`when file name is "${fileName}"`, () => {
        it(`returns timestamp of ${output}`, () => {
          const expectedTime = new Date(output).valueOf();

          expect(getCreationTimeFromFileName(fileName)).toBe(expectedTime);
        });
      });
    });
  });
});
