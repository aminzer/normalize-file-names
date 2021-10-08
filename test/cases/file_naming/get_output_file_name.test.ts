import { getOutputFileName } from '../../../dist/file_naming';

describe('getOutputFileName', () => {
  describe("when file name doesn't contain extension", () => {
    it('returns filename containing creation time in expected format', () => {
      const fileName = 'test';
      const creationTime = new Date('2001-02-03 04:05:06').valueOf();
      const expectedFileName = '2001.02.03_04.05.06.000';

      expect(getOutputFileName(fileName, creationTime)).toBe(expectedFileName);
    });
  });

  describe('when file name contains extension', () => {
    it('returns filename containing creation time in expected format', () => {
      const fileName = 'test.jpg';
      const creationTime = new Date('2001-02-03 04:05:06').valueOf();
      const expectedFileName = '2001.02.03_04.05.06.000.jpg';

      expect(getOutputFileName(fileName, creationTime)).toBe(expectedFileName);
    });
  });
});
