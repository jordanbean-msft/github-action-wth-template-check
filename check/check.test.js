const path = require('path');
const checkIfContainsReadmeInRootDirectory = require('./check');

const testDir = path.join(__dirname, '../tst')

test('Root directory does contain a README.md', () => {

  const inputPath = path.join(testDir, 'valid');

  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory does not contain a README.md', () => {

  const inputPath = path.join(testDir, 'invalid', 'doesNotContainReadme');

  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeFalsy();
});
