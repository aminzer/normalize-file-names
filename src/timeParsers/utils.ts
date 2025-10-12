import { parse } from 'date-fns';

export const parseDate = (dateStr: string, dateFormat: string = 'yyyyMMddHHmmss'): number => {
  return parse(dateStr, dateFormat, new Date(0)).valueOf();
};
