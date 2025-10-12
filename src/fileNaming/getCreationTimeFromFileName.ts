import { parse } from 'node:path';
import timeParsers from '../timeParsers/index.js';

export default function getCreationTimeFromFileName(fileName: string): number | null {
  const { name } = parse(fileName);

  for (let i = 0; i < timeParsers.length; i += 1) {
    const time = timeParsers[i](name);

    if (time !== null && Number.isFinite(time)) {
      return time;
    }
  }

  return null;
}
