const core = require('@actions/core');
const { 
  checkIfDirectoryExistsInRootDirectory,
  checkIfContainsReadmeInRootDirectory
} = require('./rootDirectoryChecks');
const {
  checkIfContainsChildDirectoryInParentDirectory
} = require('./childDirectoryChecks');
const {
  checkIfLhsPagesDoNotContainReferencesToRhsPages
} = require('./fileChecks');

module.exports = {
  checkIfContainsReadmeInRootDirectory: (inputPath) => {
    core.info(`Checking to see if README.md is in root of directory ${inputPath} ...`);
    
    return checkIfContainsReadmeInRootDirectory(inputPath);
  },

  checkIfContainsCoachInRootDirectory: (inputPath) => {
    core.info(`Checking to see if Coach directory in in root of directory ${inputPath} ...`);
    return checkIfDirectoryExistsInRootDirectory(inputPath, 'Coach');
  },

  checkIfContainsStudentInRootDirectory: (inputPath) => {
    core.info(`Checking to see if Student directory is in root of directory ${inputPath} ...`);
    return checkIfDirectoryExistsInRootDirectory(inputPath, 'Student');
  },

  checkIfContainsSolutionsInCoachDirectory: (inputPath) => {
    core.info(`Checking to see if Solutions directory is in Coach directory of ${inputPath} ...`);
    return checkIfContainsChildDirectoryInParentDirectory(inputPath, 'Coach', 'Solutions');
  },

  checkIfContainsResourcesInStudentDirectory: (inputPath) => {
    core.info(`Checking to see if Resources directory is in Student directory of ${inputPath} ...`);
    return checkIfContainsChildDirectoryInParentDirectory(inputPath, 'Student', 'Resources');
  },

  checkIfStudentPagesDoNotContainReferencesToCoachesPages: (inputPath) => {
    core.info(`Checking to see if any Student pages link to any Coach pages in ${inputPath} ...`);
    return checkIfLhsPagesDoNotContainReferencesToRhsPages(inputPath, 'Student', 'Coach');
  }
}
