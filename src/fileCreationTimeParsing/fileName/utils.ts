import { parse } from 'date-fns';

export const parseDate = (dateStr: string, { format }: { format: string }): Date => {
  return parse(dateStr, format, new Date(0));
};
