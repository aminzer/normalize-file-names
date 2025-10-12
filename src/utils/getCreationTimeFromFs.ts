import { stat } from 'node:fs/promises';

export default async function getCreationTimeFromFs(filePath: string): Promise<number> {
  const { birthtime, mtime } = await stat(filePath);

  return Math.min(birthtime.valueOf(), mtime.valueOf());
}
