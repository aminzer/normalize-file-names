import { getCreationTimeFromFileName } from '../../../dist/file_naming';

type Case = {
  input: string;
  output: string | number;
};

const recognizableCases: Case[] = [{
  input: '1600000000000',
  output: new Date(1600000000000).valueOf(),
}, {
  input: '20010203040506',
  output: '2001-02-03 04:05:06',
}, {
  input: 'IMG_20010203040506',
  output: '2001-02-03 04:05:06',
}, {
  input: 'IMG_20010203_040506',
  output: '2001-02-03 04:05:06',
}, {
  input: 'IMG-20010203-040506',
  output: '2001-02-03 04:05:06',
}, {
  input: 'IMG.20010203.040506',
  output: '2001-02-03 04:05:06',
}, {
  input: 'IMG 20010203 040506',
  output: '2001-02-03 04:05:06',
}];

describe('getCreationTimeFromFileName', () => {
  describe("when file name doesn't contain recognizable time", () => {
    it('returns null', () => {
      const fileName = 'no-time-here-123.jpg';

      expect(getCreationTimeFromFileName(fileName)).toBe(null);
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
