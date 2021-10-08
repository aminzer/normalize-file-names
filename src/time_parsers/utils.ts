import { parse } from 'date-fns';

// eslint-disable-next-line import/prefer-default-export
export function parseDate(dateStr: string, dateFormat: string = 'yyyyMMddHHmmss'): number {
  return parse(dateStr, dateFormat, new Date(0)).valueOf();
}
