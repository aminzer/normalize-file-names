import { parseDate } from './utils.js';
import { TimeParser } from './types.js';
import { d2, d3, d4, d6, d8, d14, _ } from './regex.js';

const timeParsers: TimeParser[] = [
  (input: string): number | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}${_}${d2}${_}${d2}${_}${d2}${_}${d3}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 8).join('');
    return parseDate(timeStr, 'yyyyMMddHHmmssSSS');
  },
  (input: string): number | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}${_}${d2}${_}${d2}${_}${d2}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 7).join('');
    return parseDate(timeStr);
  },
  (input: string): number | null => {
    const match = input.match(`${d8}${_}${d6}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 3).join('');
    return parseDate(timeStr);
  },
  (input: string): number | null => {
    const match = input.match(`${d4}${_}${d2}${_}${d2}`);
    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 4).join('');
    return parseDate(timeStr, 'yyyyMMdd');
  },
  (input: string): number | null => {
    const match = input.match(d14);
    return match ? parseDate(match[1]) : null;
  },
  (input: string): number | null => (/^\d+$/.test(input) ? +input : null),
];

export default timeParsers;
