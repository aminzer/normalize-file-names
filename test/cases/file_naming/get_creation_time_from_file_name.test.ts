import { getCreationTimeFromFileName } from '../../../dist/file_naming';

type Case = {
  input: string;
  output: string | number;
};

const cases: Case[] = [{
  input: '20010203040506',
  output: '2001-02-03 04:05:06',
}, {
  input: '1600000000000',
  output: new Date(1600000000000).valueOf(),
}];

describe('getCreationTimeFromFileName', () => {
  cases.forEach(({ input, output }) => {
    const fileName = `${input}.jpg`;

    describe(`when input file is "${fileName}"`, () => {
      it(`return timestamp of ${output}`, () => {
        const expectedTime = new Date(output).valueOf();

        expect(getCreationTimeFromFileName(fileName)).toBe(expectedTime);
      });
    });
  });
});
