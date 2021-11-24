const fs = require('fs');
const core = require('@actions/core');

module.exports = {
  checkIfDirectoryExistsInRootDirectory: (inputPath, directoryName) => {
    const files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isDirectory && file.name == directoryName) {
        return true;
      }
    });
  },

  checkIfContainsReadmeInRootDirectory: (inputPath) => {
    core.info(`Checking to see if README.md is in root of directory ${inputPath} ...`)
    
    const files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isFile && file.name == 'README.md') {
        return true;
      }
    });
  }
}
