import { getCreationTimeFromFileName } from '../../../dist/file_naming';

describe('getCreationTimeFromFileName', () => {
  it('parses concatenated date and time', () => {
    expect(getCreationTimeFromFileName('20200101102030.jpg')).toBe(new Date('2020-01-01 10:20:30').valueOf());
  });

  it('parses timestamp', () => {
    expect(getCreationTimeFromFileName('1600000000000.jpg')).toBe(1600000000000);
  });
});
