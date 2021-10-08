import { parseDate } from './utils';
import { TimeParser } from './types';

const sep = '[ ._-]';

const timeParsers: TimeParser[] = [
  (input: string): number => {
    const match = input.match(/.*(\d{14}).*/);
    return match ? parseDate(match[1], 'yyyyMMddHHmmss') : null;
  },
  (input: string): number => {
    const match = input.match(new RegExp(`.*(\\d{8})${sep}(\\d{6}).*`));
    return match ? parseDate(match[1] + match[2], 'yyyyMMddHHmmss') : null;
  },
  (input: string): number => (/^\d+$/.test(input) ? +input : null),
];

export default timeParsers;
