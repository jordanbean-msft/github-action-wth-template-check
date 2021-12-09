const fs = require('fs');
const core = require('@actions/core');

module.exports = {
  checkIfDirectoryExistsInRootDirectory: (inputPath, directoryName) => {
    core.debug(`Checking if the ${inputPath} contains a ${directoryName} in the root directory...`)
    const files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isDirectory && file.name == directoryName) {
        return true;
      }
    });
  },

  checkIfContainsReadmeInRootDirectory: (inputPath) => {
    core.debug(`Checking if the ${inputPath} contains a README.md file in the root directory...`)
    const files = fs.readdirSync(inputPath, { withFileTypes: true });

    return files.some((file) => {
      if(file.isFile && file.name.match(/^README\.md$/i)) {
        return true;
      }
    });
  }
}
