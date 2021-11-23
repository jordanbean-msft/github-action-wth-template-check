const path = require('path')
const fs = require('fs')

let checkIfContainsReadmeInRootDirectory = (inputPath) => {
  files = fs.readdirSync(inputPath, { withFileTypes: true });

  return files.some((file) => {
    if(file.isFile && file.name == 'README.md') {
      return true;
    }
  });
}

module.exports = checkIfContainsReadmeInRootDirectory;