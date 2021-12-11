import * as path from 'path';

export default function getNextPossibleFilePath(filePath: string): string {
  const { dir, name, ext } = path.parse(filePath);

  const postfixMatch = name.match(/^(.+)__(\d+)$/);

  const baseName = postfixMatch ? postfixMatch[1] : name;
  const postfix = postfixMatch ? (+postfixMatch[2] + 1) : 1;

  return path.join(dir, `${baseName}__${postfix}${ext}`);
}
