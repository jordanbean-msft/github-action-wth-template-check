const path = require('path')
const fs = require('fs')

module.exports = {
  checkIfContainsReadmeInRootDirectory: (inputPath) => {
    files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isFile && file.name == 'README.md') {
        return true;
      }
    });
  },

  checkIfContainsCoachInRootDirectory:  (inputPath) => {
    files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isDirectory && file.name == 'Coach') {
        return true;
      }
    });
  }
};
