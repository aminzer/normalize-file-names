const digitsGroup = (length: number) => `(\\d{${length}})`;

export const d2 = digitsGroup(2);
export const d3 = digitsGroup(3);
export const d4 = digitsGroup(4);
export const d6 = digitsGroup(6);
export const d8 = digitsGroup(8);
export const d9 = digitsGroup(9);
export const d14 = digitsGroup(14);
export const d17 = digitsGroup(17);

/**
 * Separator between the components of a date or a time, e.g. "2001-02-03", "04:05:06".
 */
export const _ = '[ ._:-]';

/**
 * Separator between the date and the time parts of a timestamp. Besides the regular separators,
 * it allows the ISO 8601 "T" designator ("2001-02-03T04:05:06") and the word used by messenger
 * apps ("WhatsApp Image 2001-02-03 at 04.05.06").
 */
export const dateTimeSeparator = `(?:${_}+(?:at${_}+)?|T)`;

/**
 * Builds a global regular expression that matches the pattern only when it's not surrounded by
 * other digits, so that time is not extracted from a part of a longer digit sequence.
 * For example, "20010203" must not be extracted from "202301021" or "20250101123456789012".
 */
export const buildDigitBoundedRegExp = (pattern: string): RegExp =>
  new RegExp(`(?<!\\d)(?:${pattern})(?!\\d)`, 'g');
