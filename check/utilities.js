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

const getAllFilePathsWithExtension = (dirPath, extension, arrayOfFilePaths) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFilePaths = arrayOfFilePaths || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFilePaths = getAllFilePathsWithExtension(dirPath + "/" + file, extension, arrayOfFilePaths);
    } else {
      //if the file has the required extension
      if(file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2).localeCompare(extension) === 0) {
        arrayOfFilePaths.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFilePaths;
};

module.exports = {
  getAllDirectories: getAllDirectories,
  getAllFilePathsWithExtension: getAllFilePathsWithExtension
}
