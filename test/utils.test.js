import { parseFoldersToGlobs } from '../src/utils';

jest.mock('fs', () => {
  return {
    statSync(pattern) {
      return {
        isDirectory() {
          return pattern.indexOf('/path/') === 0;
        },
      };
    },
  };
});

test('parseFoldersToGlobs should return globs for folders', () => {
  const withoutSlash = '/path/to/code';
  const withSlash = `${withoutSlash}/`;

  expect(parseFoldersToGlobs(withoutSlash, 'js')).toMatchInlineSnapshot(`
    Array [
      "/path/to/code/**/*.js",
    ]
  `);
  expect(parseFoldersToGlobs(withSlash, 'js')).toMatchInlineSnapshot(`
    Array [
      "/path/to/code/**/*.js",
    ]
  `);

  expect(
    parseFoldersToGlobs(
      [withoutSlash, withSlash, '/some/file.js'],
      ['js', 'cjs', 'mjs']
    )
  ).toMatchInlineSnapshot(`
    Array [
      "/path/to/code/**/*.{js,cjs,mjs}",
      "/path/to/code/**/*.{js,cjs,mjs}",
      "/some/file.js",
    ]
  `);
});

test('parseFoldersToGlobs should return unmodified globs for globs (ignoring extensions)', () => {
  expect(parseFoldersToGlobs('**.notjs', 'js')).toMatchInlineSnapshot(`
    Array [
      "**.notjs",
    ]
  `);
});
