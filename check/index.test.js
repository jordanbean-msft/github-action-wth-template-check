const path = require('path');
const { 
  checkIfContainsReadmeInRootDirectory, 
  checkIfContainsCoachInRootDirectory,
  checkIfContainsStudentInRootDirectory,
  checkIfContainsSolutionsInCoachDirectory,
  checkIfContainsResourcesInStudentDirectory,
  checkIfStudentPagesDoNotContainReferencesToCoachesPages
} = require('./index');

const testDir = path.join(__dirname, '../tst')

// README tests
test('Root directory does contain a README.md', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a README.md', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainReadme');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeFalsy();
});

// Coach tests
test('Root directory does contain a Coach directory', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a Coach directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainCoachDirectory');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeFalsy();
});

// Student tests
test('Root directory does contain a Student directory', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsStudentInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a Student directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainStudentDirectory');
  expect(checkIfContainsStudentInRootDirectory(inputPath)).toBeFalsy();
});

// Coach/Solution tests
test('Coach directory does contain a Solutions directory', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsSolutionsInCoachDirectory(inputPath)).toBeTruthy();
});

test('Coach directory must contain a Solutions directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainSolutionsInCoachDirectory');
  expect(checkIfContainsSolutionsInCoachDirectory(inputPath)).toBeFalsy();
});

// Student/Solution tests
test('Student directory does contain a Resources directory', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfContainsResourcesInStudentDirectory(inputPath)).toBeTruthy();
});

test('Student directory must contain a Resources directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainResourcesInStudentDirectory');
  expect(checkIfContainsResourcesInStudentDirectory(inputPath)).toBeFalsy();
});

// Student pages don't contain references to Coach files
test('Student pages dont contain references to Coach files', () => {
  const inputPath = path.join(testDir, 'valid');
  expect(checkIfStudentPagesDoNotContainReferencesToCoachesPages(inputPath)).toBeTruthy();
});

test('Student pages must not contain references to Coach files', () => {
  const inputPath = path.join(testDir, 'invalid', 'studentFilesContainLinksToCoachPages');
  expect(checkIfStudentPagesDoNotContainReferencesToCoachesPages(inputPath)).toBeFalsy();
});