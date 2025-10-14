import assert from 'node:assert';
import { describe, it } from 'node:test';
import getCreationTimeFromFileName from '../getCreationTimeFromFileName.js';

describe('getCreationTimeFromFileName', () => {
  describe("when file name doesn't contain recognizable time", () => {
    const unrecognizableFilenames = [
      'no-time-here-123.jpg',
      '200089800743_138740.jpg',
      'random_name',
      'IMG_abcdefghijk.jpg',
      '2001_01_00.jpg',
      '2001_01_32.jpg',
      '2001_04_31.jpg',
      '2001_00_01.jpg',
      '2001_13_01.jpg',
    ];

    unrecognizableFilenames.forEach((fileName) => {
      describe(`when file name is "${fileName}"`, () => {
        it('returns null', () => {
          assert.strictEqual(getCreationTimeFromFileName(fileName), null);
        });
      });
    });
  });

  describe('when file name contains recognizable time', () => {
    const recognizableCases: { filePath: string; expectedCreationTime: Date }[] = [
      ...[
        '20010203040506.jpg',
        '/absolute/path/to/file/20010203040506.jpg',
        'file_without_extension_20010203040506',
        'IMG_20010203040506.png',
        'IMG_20010203040506_1.jpg',
        'IMG_20010203_040506.png',
        'IMG_20010203_040506_1.jpg',
        'IMG-20010203-040506.jpg',
        'IMG.20010203.040506.jpg',
        'IMG 20010203 040506.jpg',
        '2001_02_03_04_05_06.jpg',
        'IMG_2001_02_03_04_05_06.jpg',
        'IMG_2001_02_03_04_05_06_1.jpg',
        'IMG_2001_02_03_04_05_06__1.jpg',
        'IMG_2001_02_03_04_05_06___1.jpg',
        'IMG_2001_02_03_04_05_06___unknown_postfix.jpg',
        'IMG_2001-02-03_04-05-06.jpg',
        'IMG 2001 02 03 04 05 06.jpg',
        'IMG-2001.02.03-04.05.06.jpg',
        'IMG_2001_02_03__04_05_06.jpg',
        'IMG_2001_02_03___04_05_06.jpg',
        'some-text-here-2001-02-03-04-05-06.jpg',
        '20010203_040506.jpg',
      ].map((filePath) => ({
        filePath,
        expectedCreationTime: new Date('2001-02-03 04:05:06'),
      })),
      ...['2001 02 03.jpg', '2001.02.03.jpg', '2001_02_03.jpg', '2001-02-03.jpg'].map(
        (filePath) => ({
          filePath,
          expectedCreationTime: new Date('2001-02-03 00:00:00'),
        }),
      ),
      {
        filePath: 'IMG_2001_02_03_04_05_06_007.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06.007'),
      },
      {
        filePath: 'IMG_2001_02_03__04_05_06_007.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06.007'),
      },
      {
        filePath: 'IMG_2001_02_03___04_05_06_007.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06.007'),
      },
      {
        filePath: 'IMG_2001_02_03___04_05_06_007__1.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06.007'),
      },
      {
        filePath: '2021.12.26.jpg',
        expectedCreationTime: new Date('2021.12.26 00:00:00'),
      },
      {
        filePath: '20220417_212557.jpg',
        expectedCreationTime: new Date('2022.04.17 21:25:57'),
      },
      {
        filePath: '20220417__212557.jpg',
        expectedCreationTime: new Date('2022.04.17 21:25:57'),
      },
      {
        filePath: '20220417___212557.jpg',
        expectedCreationTime: new Date('2022.04.17 21:25:57'),
      },
      {
        filePath: 'IMG_20220417_212557123.png',
        expectedCreationTime: new Date('2022.04.17 21:25:57.123'),
      },
      {
        filePath: 'IMG_20220417__212557123.png',
        expectedCreationTime: new Date('2022.04.17 21:25:57.123'),
      },
      {
        filePath: 'IMG_20220417___212557123.png',
        expectedCreationTime: new Date('2022.04.17 21:25:57.123'),
      },
      {
        filePath: '20010203040506789.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06.789'),
      },
      {
        filePath: '20010203040506.jpg',
        expectedCreationTime: new Date('2001-02-03 04:05:06'),
      },
      {
        filePath: '1600000000000.jpg',
        expectedCreationTime: new Date(1600000000000),
      },
      {
        filePath: 'some-file-20250315.txt',
        expectedCreationTime: new Date('2025.03.15 00:00:00'),
      },
    ];

    recognizableCases.forEach(({ filePath, expectedCreationTime }) => {
      describe(`when file path is "${filePath}"`, () => {
        it(`returns timestamp of ${expectedCreationTime}`, () => {
          assert.strictEqual(
            getCreationTimeFromFileName(filePath)!.getTime(),
            expectedCreationTime.getTime(),
          );
        });
      });
    });
  });
});
