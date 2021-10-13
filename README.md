### Overview

[NodeJS](https://nodejs.org) utility for normalizing file names.

### Usage scope

Different media file sources might generate file names in different formats.

E.g. images captured with a smartphone camera might have following name format:
```
IMG_20150715_114509.jpg
```

And images sent via messengers - following:
```
viber_image_2015-07-15_11-45-09.jpg
```

After merging media from different sources files into a single directory it can be tricky to sort files in chronological order.
Original file creation/modification timestamps might be lost in process of data transferring.

This utility can convert file names from different sources to the same format containing file creation date:
```
2015.07.15_11.45.09.000.jpg
```

Thus sorting files by name also sorts them in chronological order.

### Installation

```
git clone git@github.com:aminzer/normalize-file-names.git
cd normalize-file-names
npm i
```

### Usage

```
npm start
```

Arguments:
- `INPUT_DIR_PATH` (`string`, required) - path to the input directory containing files to rename. Files from all nested sub-directories are processed too. Files from input directory are not renamed themselves - they are copied to the output directory with new names.
- `OUTPUT_DIR_PATH` (`string`, required) - path to the output directory where renamed files are copied to. All files are copied to the output directory root regardless of their location relative to the input directory. Files with unrecognized names are copied to the special output directory subfolder named `_UNRECOGNIZED`.
- `IS_DRY_RUN` (`boolean`, `false` by default) - when enabled files are not copied to the output directory - their name changed are just logged to the console output. It can be used to check if the files can be recognized.
- `FETCH_CREATION_TIME_FROM_FS_FOR_UNRECOGNIZED_FILES` (`boolean`, `false` by default) - when enabled creation time of files with unrecognized names is fetched from File System created time or modification time (`birthtime`/`mtime` accordingly).

The arguments above can be set via one of the following methods:
- System Environment Variables 
- Creating [.env file](https://www.npmjs.com/package/dotenv) in the root project directory
