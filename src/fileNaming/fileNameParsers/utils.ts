import { parse } from 'date-fns';

export const parseDate = (dateStr: string, dateFormat: string = 'yyyyMMddHHmmss'): Date => {
  return parse(dateStr, dateFormat, new Date(0));
};
