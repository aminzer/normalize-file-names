import { d2, d3, d4, d6, d8, d9, d14, d17, _ } from './regex.js';
import { FileNameCreationTimeParser } from './types.js';
import { parseFirstValidDate, parseUnixTimestampMs } from './utils.js';

const parsers: FileNameCreationTimeParser[] = [
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}${_}${d3}`,
      format: 'yyyyMMddHHmmssSSS',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}${d2}${_}${d2}${_}+${d2}${_}${d2}${_}${d2}`,
      format: 'yyyyMMddHHmmss',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d8}${_}+${d9}`,
      format: 'yyyyMMddHHmmssSSS',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d8}${_}+${d6}`,
      format: 'yyyyMMddHHmmss',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}${d2}${_}${d2}`,
      format: 'yyyyMMdd',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d17,
      format: 'yyyyMMddHHmmssSSS',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d14,
      format: 'yyyyMMddHHmmss',
    }),

  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d8,
      format: 'yyyyMMdd',
    }),

  (fileName: string): Date | null =>
    /^\d+$/.test(fileName) ? parseUnixTimestampMs(fileName) : null,
];

export default parsers;
