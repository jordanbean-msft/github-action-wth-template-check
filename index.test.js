const path = require('path');
const {
   run,
   getPaths,
   excludePathsToNotFailOn
 } = require('./index');
const core = require('@actions/core');

const testDir = path.join(__dirname, './tst')

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

// describe('Run on specific valid directory succeeds', () => {
//   const originalEnv = process.env;

//   beforeEach(() => {
//     jest.resetModules();
//     const inputPath = path.join(testDir, '000-valid');
//     process.env = {
//       ...originalEnv,
//       INPUT_PATH: inputPath,
//       INPUT_SHOULDSCANALLSUBDIRECTORIES: 'false'
//     };
//   });

//   afterEach(() => {
//     process.env = originalEnv;
//   });

//   it('Run on specific valid directory succeeds', () => {
//     run();
//     expect(process.exitCode).toEqual(0);
//   });
// });

// describe('Run on specific invalid directory succeeds', () => {
//   const originalEnv = process.env;

//   beforeEach(() => {
//     jest.resetModules();
//     const inputPath = path.join(testDir, 'invalid');
//     process.env = {
//       ...originalEnv,
//       INPUT_PATH: inputPath,
//       INPUT_SHOULDSCANALLSUBDIRECTORIES: 'false'
//     };
//   });

//   afterEach(() => {
//     process.env = originalEnv;
//   });

//   it('Run on specific invalid directory succeeds', () => {
//     run();
//     expect(process.exitCode).toEqual(1);
//   });
// });