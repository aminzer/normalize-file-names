const digitsGroup = (length: number) => `(\\d{${length}})`;

export const d2 = digitsGroup(2);
export const d4 = digitsGroup(4);
export const d6 = digitsGroup(6);
export const d8 = digitsGroup(8);
export const d14 = digitsGroup(14);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _ = '[ ._-]';
