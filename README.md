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

When you merge files from multiple sources into a single folder, chronological sorting can break—especially if the original creation / modification timestamps were lost during transfer.

This utility renames files into a consistent format that encodes the date and time:

```
2025_07_15__11_45_09_000.jpg
```

This way, **sorting by file name = sorting by time**.

---

### Installation

```bash
git clone git@github.com:aminzer/normalize-file-names.git
cd normalize-file-names
npm install
```

---

### Usage

```bash
npm start
```

#### Arguments

| Name                       | Type      | Default | Description                                                                                                                                                                                                                   |
| -------------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`INPUT_DIR_PATH`**       | `string`  | —       | Path to the input directory containing files to rename. Files in nested subdirectories are also processed. The original files are not renamed — instead, copies are created in the output directory.                          |
| **`OUTPUT_DIR_PATH`**      | `string`  | —       | Path to the output directory where renamed files are written. All files with recognized names are copied directly into this directory’s root (subdirectory structure is flattened). Files with unrecognized names are copied into `_UNRECOGNIZED` subdirectory of the output directory. |
| **`DRY_RUN`**              | `boolean` | `false` | If enabled, files are not copied. Instead, the planned name changes are logged to the console. Useful for testing recognition logic.                                                                                          |
| **`FS_METADATA_FALLBACK`** | `boolean` | `false` | If enabled, files with unrecognized names will fall back to using filesystem metadata: the earlier of the file’s creation (`birthtime`) and modification (`mtime`) timestamps. Files with names recognized from FS metadata are copied into `_RECOGNIZED_FROM_FS` subdirectory of the output directory.

---

### Configuration

You can set the arguments using one of the following methods:

1. **Environment variables**
   ```bash
   INPUT_DIR_PATH=/path/to/input OUTPUT_DIR_PATH=/path/to/output npm start
   ```

2. **`.env` file**  
   Create a `.env` file in the project root (supported via [dotenv](https://www.npmjs.com/package/dotenv)):

   ```env
   INPUT_DIR_PATH=/path/to/input
   OUTPUT_DIR_PATH=/path/to/output
   DRY_RUN=true
   FS_METADATA_FALLBACK=false
   ```

---

### Example

```bash
INPUT_DIR_PATH=~/photos/raw \
OUTPUT_DIR_PATH=~/photos/normalized \
FS_METADATA_FALLBACK=true \
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
