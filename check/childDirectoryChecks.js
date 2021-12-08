const path = require('path');
const fs = require('fs');
const {
  getAllDirectories
} = require('./utilities');
const core = require('@actions/core');

module.exports = {
  checkIfContainsChildDirectoryInParentDirectory: (inputPath, parentDirectoryName, childDirectoryName) => {
    core.debug(`Checking if ${inputPath} contains a parent directory ${parentDirectoryName} with a child directory ${childDirectoryName}...`)
    let arrayOfDirectories = [];
    const files = getAllDirectories(inputPath, arrayOfDirectories);

    return files.some((file) => {
      if(fs.statSync(file).isDirectory()) {
        const elements = file.split(path.sep)

        if(elements.length < 2) {
          throw new Error(`Number of path ${file} splits cannot be less than 2.`);
        }

        if(elements[elements.length - 2] == parentDirectoryName && elements[elements.length - 1] == childDirectoryName) {
          return true;
        }
      }
    });
  }
}