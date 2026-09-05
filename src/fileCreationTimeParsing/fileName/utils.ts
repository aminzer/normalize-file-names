import { isValid, parse } from 'date-fns';
import { buildDigitBoundedRegExp } from './regex.js';

/**
 * Dates outside of this range are treated as unrecognized, since arbitrary digit sequences
 * (IDs, version numbers, etc.) can structurally look like a valid date.
 * The lower bound is loose enough to keep scanned analog photos recognizable.
 */
const MIN_PLAUSIBLE_YEAR = 1900;
const MAX_PLAUSIBLE_YEAR = 2100;

/**
 * Unix timestamps have a stricter lower bound: small numeric file names (IDs, counters, unix
 * timestamps in seconds) would otherwise be recognized as dates around 1970.
 */
const MIN_PLAUSIBLE_UNIX_TIMESTAMP_YEAR = 1990;

const parseDate = (dateStr: string, { format }: { format: string }): Date => {
  return parse(dateStr, format, new Date(0));
};

const isPlausibleDate = (date: Date, { minYear }: { minYear: number }): boolean => {
  if (!isValid(date)) {
    return false;
  }

  const year = date.getFullYear();

  return year >= minYear && year <= MAX_PLAUSIBLE_YEAR;
};

/**
 * Returns the date parsed from the first occurrence of the pattern that yields a plausible date.
 * Later occurrences are examined as well, since an earlier one can match the pattern structurally
 * but still contain an invalid date - e.g. "20259999" in "IMG_20259999_20250101_123456".
 */
export const parseFirstValidDate = (
  fileName: string,
  { pattern, format }: { pattern: string; format: string },
): Date | null => {
  for (const match of fileName.matchAll(buildDigitBoundedRegExp(pattern))) {
    const date = parseDate(match.slice(1).join(''), { format });

    if (isPlausibleDate(date, { minYear: MIN_PLAUSIBLE_YEAR })) {
      return date;
    }
  }

  return null;
};

/**
 * Returns the date parsed from a unix timestamp in milliseconds.
 */
export const parseUnixTimestampMs = (timestampStr: string): Date | null => {
  const date = new Date(Number(timestampStr));

  return isPlausibleDate(date, { minYear: MIN_PLAUSIBLE_UNIX_TIMESTAMP_YEAR }) ? date : null;
};
