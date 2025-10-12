export interface SyncFileCreationTimeParser {
  (filePath: string): Date | null;
}

export interface AsyncFileCreationTimeParser {
  (filePath: string): Promise<Date | null>;
}
