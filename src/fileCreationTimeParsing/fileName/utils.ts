import { isValid, parse } from 'date-fns';
import { buildDigitBoundedRegExp } from './regex.js';

const MIN_PLAUSIBLE_YEAR = 1990;
const MAX_PLAUSIBLE_YEAR = 2100;

const parseDate = (dateStr: string, { format }: { format: string }): Date => {
  return parse(dateStr, format, new Date(0));
};

/**
 * Returns the date parsed from the first occurrence of the pattern that yields a valid date.
 * Later occurrences are examined as well, since an earlier one can match the pattern structurally
 * but still contain an invalid date - e.g. "20259999" in "IMG_20259999_20250101_123456".
 */
export const parseFirstValidDate = (
  fileName: string,
  { pattern, format }: { pattern: string; format: string },
): Date | null => {
  for (const match of fileName.matchAll(buildDigitBoundedRegExp(pattern))) {
    const date = parseDate(match.slice(1).join(''), { format });

    if (isValid(date)) {
      return date;
    }
  }

  return null;
};

/**
 * Returns the date parsed from a unix timestamp in milliseconds.
 * Values resulting in an implausible year are rejected, since arbitrary numeric file names
 * (IDs, unix timestamps in seconds, etc.) would otherwise be recognized as dates around 1970.
 */
export const parseUnixTimestampMs = (timestampStr: string): Date | null => {
  const date = new Date(Number(timestampStr));

  if (!isValid(date)) {
    return null;
  }

  const year = date.getFullYear();

  return year >= MIN_PLAUSIBLE_YEAR && year <= MAX_PLAUSIBLE_YEAR ? date : null;
};
