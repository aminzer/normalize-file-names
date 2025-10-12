import { join, parse } from 'node:path';

const getNextFileVersionPath = (filePath: string): string => {
  const { dir, name, ext } = parse(filePath);

  const postfixMatch = name.match(/^(.+)__(\d+)$/);

  const baseName = postfixMatch ? postfixMatch[1] : name;
  const postfix = postfixMatch ? +postfixMatch[2] + 1 : 1;

  return join(dir, `${baseName}__${postfix}${ext}`);
};

export default getNextFileVersionPath;
