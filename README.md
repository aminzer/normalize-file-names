# normalize-file-names

### Overview

[Node.js](https://nodejs.org) utility for file name normalizing based on embedded or inferred creation dates.

It helps bring order to media files originating from various devices or apps by renaming them into a unified, chronological format.

---

### Why

Different devices and apps use inconsistent file naming conventions.
For example:

**Smartphone camera:**

```
IMG_20250715_114509.jpg
```

**Messenger app (e.g., Viber):**

```
viber_image_2025-07-15_11-45-09.jpg
```

When you merge files from multiple sources into a single folder, chronological sorting can break - especially if the original creation / modification timestamps were lost during transfer.

This utility renames files into a consistent format that encodes the date and time:

```
2025_07_15__11_45_09_000.jpg
```

This way, **sorting by file name = sorting by time**.

---

### Installation

```bash
npm install @aminzer/normalize-file-names
```

---

### Programmatic usage

```ts
import { normalizeFileNames } from '@aminzer/normalize-file-names';

await normalizeFileNames({
  inputDirPath: '/path/to/input',
  outputDirPath: '/path/to/output',
});
```

#### `normalizeFileNames` parameters

- **`inputDirPath`** (`string`, required) — Path to the input directory containing files to rename. Files in nested subdirectories are also processed. The original files are not modified — copies are created in the output directory.
- **`outputDirPath`** (`string`, required) — Path to the output directory where renamed files are written. All files with recognized names are copied directly into this directory's root (subdirectory structure is flattened).
- **`outputFileNameFormat`** (`string`, required) — Format of the output file names, using [date-fns format](https://date-fns.org/v4.1.0/docs/format).
- **`unrecognizedFilesOutputDirPath`** (`string`, optional, default: `<outputDirPath>/_UNRECOGNIZED`) — Path to the directory where files with unrecognized names are copied.
- **`recognizedFromFsFilesOutputDirPath`** (`string`, optional, default: `<outputDirPath>/_RECOGNIZED_FROM_FS`) — Path to the directory where files recognized via filesystem metadata are copied.
- **`isFileSystemMetadataFallbackEnabled`** (`boolean`, optional, default: `false`) — If enabled, files with unrecognized names will fall back to using filesystem metadata: the earlier of the file's creation (`birthtime`) and modification (`mtime`) timestamps.
- **`isDryRun`** (`boolean`, optional, default: `false`) — If enabled, files are not copied. Instead, the planned name changes are logged. Useful for testing recognition logic.
- **`logger`** (`LoggerInterface`, optional, default: `NoopLogger`) — Logger instance for progress and diagnostic output.

The package also exports `LoggerInterface` and `StdoutLogger`.

`LoggerInterface` defines the logging contract expected by `normalizeFileNames`:

- **`log(message: string): void`** — logs a message on a new line.
- **`logSingleLine(message: string): void`** — logs a message by overwriting the current line (used for progress indicators).
- **`clearSingleLine(): void`** — clears the current single-line output.

`StdoutLogger` is a built-in implementation that writes progress and diagnostics to stdout:

```ts
import { normalizeFileNames, StdoutLogger } from '@aminzer/normalize-file-names';

await normalizeFileNames({
  inputDirPath: '/path/to/input',
  outputDirPath: '/path/to/output',
  logger: new StdoutLogger(),
});
```

You can provide your own implementation of `LoggerInterface` for custom logging behavior.

---

### CLI usage

```bash
npm install --global @aminzer/normalize-file-names
```

```bash
normalize-file-names --input <path> --output <path> [options]
```

#### Flags

| Flag | Parameter |
| --- | --- |
| `-i, --input <path>` | `inputDirPath` |
| `-o, --output <path>` | `outputDirPath` |
| `--output-file-name-format <fmt>` | `outputFileNameFormat` |
| `--fs-metadata-fallback` | `isFileSystemMetadataFallbackEnabled` |
| `--dry-run` | `isDryRun` |

**Example:**

```bash
normalize-file-names \
  --input ~/photos/raw \
  --output ~/photos/normalized \
  --fs-metadata-fallback
```

---

### Usage from project root

```bash
git clone git@github.com:aminzer/normalize-file-names.git
cd normalize-file-names
npm install
```

Arguments are provided via environment variables or a `.env` file:

| Name | Parameter |
| --- | --- |
| **`INPUT_DIR_PATH`** | `inputDirPath` |
| **`OUTPUT_DIR_PATH`** | `outputDirPath` |
| **`OUTPUT_FILE_NAME_FORMAT`** | `outputFileNameFormat` |
| **`FS_METADATA_FALLBACK`** | `isFileSystemMetadataFallbackEnabled` |
| **`DRY_RUN`** | `isDryRun` |

**Inline:**

```bash
INPUT_DIR_PATH=~/photos/raw \
OUTPUT_DIR_PATH=~/photos/normalized \
FS_METADATA_FALLBACK=true \
npm start
```

**`.env` file** in the project root:

```env
INPUT_DIR_PATH=/path/to/input
OUTPUT_DIR_PATH=/path/to/output
FS_METADATA_FALLBACK=true
DRY_RUN=false
```

```bash
npm start
```

---

### Result

Before:
```
viber_image_2025-07-15_11-45-09.jpg
IMG_20250716_231551.png
20250717.mp4
```

After:
```
2025_07_15__11_45_09_000.jpg
2025_07_16__23_15_51_000.png
2025_07_17__00_00_00_000.mp4
```

Now, simply sorting by name reflects the chronological order of your files.
