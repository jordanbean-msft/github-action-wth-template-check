const path = require('path');
const { checkIfContainsReadmeInRootDirectory, checkIfContainsCoachInRootDirectory } = require('./check');

const testDir = path.join(__dirname, '../tst')

//README tests
test('Root directory does contain a README.md', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a README.md', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainReadme');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeFalsy();
});

//Coach tests
test('Root directory does contain a Coach directory', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a Coach directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainCoachDirectory');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeFalsy();
});