#!/usr/bin/env node

import { parseArgs } from 'node:util';
import configDefaults from './config/defaults.js';
import { StdoutLogger } from './logging/index.js';
import normalizeFileNames from './normalizeFileNames/index.js';

const { values } = parseArgs({
  options: {
    input: {
      type: 'string',
      short: 'i',
    },
    output: {
      type: 'string',
      short: 'o',
    },
    'output-file-name-format': {
      type: 'string',
      default: configDefaults.outputFileNameFormat,
    },
    'fs-metadata-fallback': {
      type: 'boolean',
      default: configDefaults.isFileSystemMetadataFallbackEnabled,
    },
    'dry-run': {
      type: 'boolean',
      default: configDefaults.isDryRun,
    },
  },
  strict: true,
});

if (!values.input || !values.output) {
  console.error(
    [
      'Usage: normalize-file-names --input <path> --output <path> [options]',
      '',
      'Required:',
      '  -i, --input <path>                   Input directory path',
      '  -o, --output <path>                  Output directory path',
      '',
      'Options:',
      `  --output-file-name-format <format>   Output file name format (default: ${configDefaults.outputFileNameFormat})`,
      `  --fs-metadata-fallback               Use filesystem metadata as fallback for creation date (default: ${configDefaults.isFileSystemMetadataFallbackEnabled})`,
      `  --dry-run                            Log planned changes without copying files (default: ${configDefaults.isDryRun})`,
    ].join('\n'),
  );
  process.exit(1);
}

const logger = new StdoutLogger();

try {
  await normalizeFileNames({
    inputDirPath: values.input,
    outputDirPath: values.output,
    outputFileNameFormat: values['output-file-name-format']!,
    isFileSystemMetadataFallbackEnabled: values['fs-metadata-fallback'],
    isDryRun: values['dry-run'],
    logger,
  });
} catch (err) {
  if (err instanceof Error) {
    logger.log(`Error: ${err.message}`);
  } else {
    logger.log(`Unknown error: ${err}`);
  }
}
