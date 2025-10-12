export type FileNameCreationTimeParser = {
  (fileNameWithoutExtension: string): Date | null;
};
