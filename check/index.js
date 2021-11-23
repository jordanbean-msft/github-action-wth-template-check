const path = require('path')
const fs = require('fs')

const getAllDirectories = (dirPath, arrayOfDirectories) => {
  files = fs.readdirSync(dirPath);

  arrayOfDirectories = arrayOfDirectories || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfDirectories.push(path.join(dirPath, "/", file));
      arrayOfDirectories = getAllDirectories(dirPath + "/" + file, arrayOfDirectories);
    }
  });

  return arrayOfDirectories;
}

const checkIfDirectoryExistsInRootDirectory = (inputPath, directoryName) => {
  files = fs.readdirSync(inputPath, { withFileTypes: true });

  return files.some((file) => {
    if(file.isDirectory && file.name == directoryName) {
      return true;
    }
  });
}

const checkIfContainsChildDirectoryInParentDirectory = (inputPath, parentDirectoryName, childDirectoryName) => {
  arrayOfDirectories = [];
  files = getAllDirectories(inputPath, arrayOfDirectories);

  return files.some((file) => {
    if(fs.statSync(file).isDirectory()) {
      elements = file.split(path.sep)

      if(elements.length < 2) {
        throw new Error('Number of path {file} splits cannot be less than 2.');
      }

      if(elements[elements.length - 2] == parentDirectoryName && elements[elements.length - 1] == childDirectoryName) {
        return true;
      }
    }
  });
}

module.exports = {
checkIfContainsReadmeInRootDirectory: (inputPath) => {
  files = fs.readdirSync(inputPath, { withFileTypes: true });

  return files.some((file) => {
    if(file.isFile && file.name == 'README.md') {
      return true;
    }
  });
},

checkIfContainsCoachInRootDirectory: (inputPath) => {
  return checkIfDirectoryExistsInRootDirectory(inputPath, 'Coach')
},

checkIfContainsStudentInRootDirectory: (inputPath) => {
  return checkIfDirectoryExistsInRootDirectory(inputPath, 'Student')
},

checkIfContainsSolutionsInCoachDirectory: (inputPath) => {
  return checkIfContainsChildDirectoryInParentDirectory(inputPath, 'Coach', 'Solutions')
},

checkIfContainsResourcesInStudentDirectory: (inputPath) => {
  return checkIfContainsChildDirectoryInParentDirectory(inputPath, 'Student', 'Resources')
},
}
