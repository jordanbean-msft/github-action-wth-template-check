const path = require('path');
const { 
  checkIfContainsReadmeInRootDirectory, 
  checkIfContainsCoachInRootDirectory,
  checkIfContainsStudentInRootDirectory,
  checkIfContainsSolutionsInCoachDirectory,
  checkIfContainsResourcesInStudentDirectory,
  checkIfStudentPagesDoNotContainReferencesToCoachesPages
} = require('./index');
const {
  getPaths,
  excludePathsToNotFailOn
} = require('./utilities')

const testDir = path.join(__dirname, '../tst')

// README tests
test('Root directory does contain a README.md', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a README.md', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainReadme');
  expect(checkIfContainsReadmeInRootDirectory(inputPath)).toBeFalsy();
});

// Coach tests
test('Root directory does contain a Coach directory', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a Coach directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainCoachDirectory');
  expect(checkIfContainsCoachInRootDirectory(inputPath)).toBeFalsy();
});

// Student tests
test('Root directory does contain a Student directory', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfContainsStudentInRootDirectory(inputPath)).toBeTruthy();
});

test('Root directory must contain a Student directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainStudentDirectory');
  expect(checkIfContainsStudentInRootDirectory(inputPath)).toBeFalsy();
});

// Coach/Solution tests
test('Coach directory does contain a Solutions directory', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfContainsSolutionsInCoachDirectory(inputPath)).toBeTruthy();
});

test('Coach directory must contain a Solutions directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainSolutionsInCoachDirectory');
  expect(checkIfContainsSolutionsInCoachDirectory(inputPath)).toBeFalsy();
});

// Student/Solution tests
test('Student directory does contain a Resources directory', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfContainsResourcesInStudentDirectory(inputPath)).toBeTruthy();
});

test('Student directory must contain a Resources directory', () => {
  const inputPath = path.join(testDir, 'invalid', 'doesNotContainResourcesInStudentDirectory');
  expect(checkIfContainsResourcesInStudentDirectory(inputPath)).toBeFalsy();
});

// Student pages don't contain references to Coach files
test('Student pages dont contain references to Coach files', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(checkIfStudentPagesDoNotContainReferencesToCoachesPages(inputPath)).toBeTruthy();
});

test('Student pages must not contain references to Coach files', () => {
  const inputPath = path.join(testDir, 'invalid', 'studentFilesContainLinksToCoachPages');
  expect(checkIfStudentPagesDoNotContainReferencesToCoachesPages(inputPath)).toBeFalsy();
});

// Utilties tests
test('Paths should only include single directory', () => {
  const inputPath = path.join(testDir, '000-valid');
  expect(getPaths(false, inputPath)).toEqual([inputPath]);
})

test('Paths should contain all valid subdirectories', () => {
  const validInputPath0 = path.join(testDir, '000-valid');
  const validInputPath1 = path.join(testDir, '001-valid');
  expect(getPaths(true, testDir)).toEqual([validInputPath0, validInputPath1]);
})

test('Paths should exclude directories specified in ignore file', () => {
  const validInputPath0 = path.join(testDir, '000-valid');
  const validInputPath1 = path.join(testDir, '001-valid');
  const paths = [validInputPath0, validInputPath1];
  const directoriesToExclude = ['001-valid'];
  expect(excludePathsToNotFailOn(paths, directoriesToExclude)).toEqual([validInputPath0]);
})