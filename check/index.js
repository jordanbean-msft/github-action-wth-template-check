const path = require('path')
const fs = require('fs')
const core = require('@actions/core');
const markdownLinkExtractor = require('markdown-link-extractor')

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

const checkIfDirectoryExistsInRootDirectory = (inputPath, directoryName) => {
  files = fs.readdirSync(inputPath, { withFileTypes: true });

  return files.some((file) => {
    if(file.isDirectory && file.name == directoryName) {
      return true;
    }
  });
};

const checkIfContainsChildDirectoryInParentDirectory = (inputPath, parentDirectoryName, childDirectoryName) => {
  arrayOfDirectories = [];
  files = getAllDirectories(inputPath, arrayOfDirectories);

  return files.some((file) => {
    if(fs.statSync(file).isDirectory()) {
      elements = file.split(path.sep)

      if(elements.length < 2) {
        throw new Error(`Number of path ${file} splits cannot be less than 2.`);
      }

      if(elements[elements.length - 2] == parentDirectoryName && elements[elements.length - 1] == childDirectoryName) {
        return true;
      }
    }
  });
};

const checkIfLhsPagesDoNotContainReferencesToRhsPages = (inputPath, lhsPageDirectory, rhsPageDirectory) => {
  const markdownFilePaths = getAllFilePathsWithExtension(inputPath, 'md');
  const lhsPageDirectoryPath = path.join(inputPath, lhsPageDirectory);

  //get all file paths under the lhs directory
  const lhsPageFilePaths = markdownFilePaths.filter(file => RegExp(`^${lhsPageDirectoryPath}`).test(file));

  const pagesWithReferencesToRhsDirectory = []

  lhsPageFilePaths.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'});

    const links = markdownLinkExtractor(fileContent, true);

    //check to see if there are any references to the rhs directory (ex. ../Coach/Solution-00.md)
    const linksWithReferencesToRhsPages = links.filter(link => RegExp(`\.{2}\/${rhsPageDirectory}\/`).test(link.href));

    if(linksWithReferencesToRhsPages.length > 0) {
      pagesWithReferencesToRhsDirectory.push({
        filePath: filePath,
        links: linksWithReferencesToRhsPages
      });
    }
  });

  if(pagesWithReferencesToRhsDirectory.length > 0) {
    pagesWithReferencesToRhsDirectory.forEach(page => {
      core.error(`The following Student page contains a reference to the Coach directory: ${page.filePath}`);
      page.links.forEach(link => {
        core.error(`  ${link.raw}`)
      });
    });
    return false;
  } else {
    return true;
  }
};

module.exports = {
checkIfContainsReadmeInRootDirectory: (inputPath) => {
  core.info(`Checking to see if README.md is in root of directory ${inputPath} ...`)
  
  files = fs.readdirSync(inputPath, { withFileTypes: true });

  return files.some((file) => {
    if(file.isFile && file.name == 'README.md') {
      return true;
    }
  });
},

checkIfContainsCoachInRootDirectory: (inputPath) => {
  core.info(`Checking to see if Coach directory in in root of directory ${inputPath} ...`) ;
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
