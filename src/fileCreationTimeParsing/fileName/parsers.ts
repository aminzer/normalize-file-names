import { d2, d3, d4, d6, d8, d9, d14, d17, _ } from './regex.js';
import { FileNameCreationTimeParser } from './types.js';
import { parseDate } from './utils.js';

const parsers: FileNameCreationTimeParser[] = [
  (fileName: string): Date | null => {
    const match = fileName.match(`${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}${_}${d3}`);

    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 8).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmssSSS' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(`${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}`);

    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 7).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmss' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(`${d8}${_}+${d9}`);

    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 3).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmssSSS' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(`${d8}${_}+${d6}`);

    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 3).join('');

    return parseDate(timeStr, { format: 'yyyyMMddHHmmss' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(`${d4}${_}${d2}${_}${d2}`);

    if (!match) {
      return null;
    }

    const timeStr = match.slice(1, 4).join('');

    return parseDate(timeStr, { format: 'yyyyMMdd' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(d17);

    if (!match) {
      return null;
    }

    return parseDate(match[1], { format: 'yyyyMMddHHmmssSSS' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(d14);

    if (!match) {
      return null;
    }

    return parseDate(match[1], { format: 'yyyyMMddHHmmss' });
  },

  (fileName: string): Date | null => {
    const match = fileName.match(d8);

    if (!match) {
      return null;
    }

    return parseDate(match[1], { format: 'yyyyMMdd' });
  },

  (fileName: string): Date | null => (/^\d+$/.test(fileName) ? new Date(+fileName) : null),
];

export default parsers;
