import * as path from 'path';
import getNonExistentFileVersionPath from '../../../src/utils/get_non_existent_file_version_path';

function getResourcePath(fileName: string): string {
  return path.resolve(__dirname, '../../resources/get_non_existent_file_path', fileName);
}

describe('getNonExistentFileVersionPath', () => {
  describe("when file doesn't exist", () => {
    it('returns the file path', async () => {
      const filePath = getResourcePath('non_existing_file.txt');

      expect(await getNonExistentFileVersionPath(filePath))
        .toBe(filePath);
    });
  });

  describe('when file exists', () => {
    it('returns file path with number postfix', async () => {
      const filePath = getResourcePath('existing_file.txt');

      expect(await getNonExistentFileVersionPath(filePath))
        .toBe(getResourcePath('existing_file__1.txt'));
    });
  });

  describe('when both file and file with postfix exist', () => {
    it('returns file path with next available number postfix', async () => {
      const filePath = getResourcePath('existing_file_with_postfix.txt');

      expect(await getNonExistentFileVersionPath(filePath))
        .toBe(getResourcePath('existing_file_with_postfix__2.txt'));
    });
  });
});
