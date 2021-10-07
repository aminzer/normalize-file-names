import getNextPossibleFilePath from './get_next_possible_file_path';
import isFileExist from './is_file_exist';

export default async function getNonExistentFilePath(possibleFilePath: string): Promise<string> {
  if (!await isFileExist(possibleFilePath)) {
    return possibleFilePath;
  }

  return getNonExistentFilePath(getNextPossibleFilePath(possibleFilePath));
}
