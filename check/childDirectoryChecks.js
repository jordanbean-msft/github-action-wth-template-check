const path = require('path');
const fs = require('fs');

const getAllDirectories = (dirPath, arrayOfDirectories) => {
  const files = fs.readdirSync(dirPath);

  arrayOfDirectories = arrayOfDirectories || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfDirectories.push(path.join(dirPath, "/", file));
      arrayOfDirectories = getAllDirectories(dirPath + "/" + file, arrayOfDirectories);
    }
  });

  return arrayOfDirectories;
};

module.exports = {
  checkIfContainsChildDirectoryInParentDirectory: (inputPath, parentDirectoryName, childDirectoryName) => {
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