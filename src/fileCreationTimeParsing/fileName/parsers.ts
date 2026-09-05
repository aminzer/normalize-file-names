import { d2, d3, d4, d6, d8, d9, d14, d17, _, dateTimeSeparator as dts } from './regex.js';
import { FileNameCreationTimeParser } from './types.js';
import { parseFirstValidDate, parseUnixTimestampMs } from './utils.js';

/**
 * Parsers are ordered from the most specific pattern to the least specific one, so that a file name
 * containing a full timestamp is never recognized as a date only.
 */
const parsers: FileNameCreationTimeParser[] = [
  // 2001-02-03 04:05:06.007
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}+${d2}${_}+${d2}${dts}${d2}${_}+${d2}${_}+${d2}${_}+${d3}`,
      format: 'yyyyMMddHHmmssSSS',
    }),

  // 2001-02-03 04:05:06
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}+${d2}${_}+${d2}${dts}${d2}${_}+${d2}${_}+${d2}`,
      format: 'yyyyMMddHHmmss',
    }),

  // 20010203 040506007
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d8}${dts}${d9}`,
      format: 'yyyyMMddHHmmssSSS',
    }),

  // 20010203 040506
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d8}${dts}${d6}`,
      format: 'yyyyMMddHHmmss',
    }),

  // 20010203040506007
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d17,
      format: 'yyyyMMddHHmmssSSS',
    }),

  // 20010203040506
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d14,
      format: 'yyyyMMddHHmmss',
    }),

  // 2001-02-03
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: `${d4}${_}+${d2}${_}+${d2}`,
      format: 'yyyyMMdd',
    }),

  // 20010203
  (fileName: string): Date | null =>
    parseFirstValidDate(fileName, {
      pattern: d8,
      format: 'yyyyMMdd',
    }),

  // 1600000000000
  (fileName: string): Date | null =>
    /^\d+$/.test(fileName) ? parseUnixTimestampMs(fileName) : null,
];

export default parsers;
