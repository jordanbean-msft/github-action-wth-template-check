const path = require('path');
const fs = require('fs');
const core = require('@actions/core');

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

const getPaths = (shouldScanAllSubdirectories, inputPath) => {
  let paths = [];
  if (shouldScanAllSubdirectories) {
    core.debug(`Getting all validly named subdirectories of ${inputPath}...`);
    //only return directories that match the 'XXX-name' format
    const wthRegex = new RegExp('\\d{3}.*$');
    paths = fs.readdirSync(inputPath, { withFileTypes: true})
              .filter(directory => directory.isDirectory && wthRegex.test(directory.name))
              .map(directory => path.join(inputPath, directory.name));
  } else {
    paths.push(inputPath);
  }
  return paths;
};

const excludePathsToNotFailOn = (originalPaths, directoriesToNotFailOn) => {
  const newPaths = originalPaths.filter(originalPath => !directoriesToNotFailOn
                                                          .includes(originalPath
                                                                      .split(path.sep)
                                                                      .slice(-1)[0]));

  return newPaths;
};

module.exports = {
  getAllDirectories: getAllDirectories,
  getAllFilePathsWithExtension: getAllFilePathsWithExtension,
  getPaths: getPaths,
  excludePathsToNotFailOn: excludePathsToNotFailOn
}
