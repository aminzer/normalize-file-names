import * as fs from 'fs/promises';

export default async function getCreationTimeFromFs(filePath: string): Promise<number> {
  const { birthtime, mtime } = await fs.stat(filePath);

  return Math.min(birthtime.valueOf(), mtime.valueOf());
}
