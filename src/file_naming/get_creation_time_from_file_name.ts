import * as path from 'path';
import timeParsers from '../time_parsers';

export default function getCreationTimeFromFileName(fileName: string): number {
  const { name } = path.parse(fileName);

  for (let i = 0; i < timeParsers.length; i += 1) {
    const time = timeParsers[i](name);

    if (time !== null) {
      return time;
    }
  }

  return null;
}
