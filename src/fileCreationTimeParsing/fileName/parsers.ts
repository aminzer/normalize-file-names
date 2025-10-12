import { d2, d3, d4, d6, d8, d14, _ } from './regex.js';
import { FileNameCreationTimeParser } from './types.js';
import { parseDate } from './utils.js';

const parsers: FileNameCreationTimeParser[] = [
  (input: string): Date | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}${_}${d3}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 8).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmssSSS' });
  },

  (input: string): Date | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 7).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmss' });
  },

  (input: string): Date | null => {
    const match = input.match(`${d8}${_}+${d6}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 3).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmss' });
  },

  (input: string): Date | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 4).join('');

    return parseDate(timeStr, { format: 'yyyyMMdd' });
  },

  (input: string): Date | null => {
    const match = input.match(d14);

    return match ? parseDate(match[1], { format: 'yyyyMMddHHmmss' }) : null;
  },

  (input: string): Date | null => (/^\d+$/.test(input) ? new Date(+input) : null),
];

export default parsers;
