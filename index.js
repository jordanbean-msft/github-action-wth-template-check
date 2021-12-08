const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const {
  checkIfContainsReadmeInRootDirectory,
  checkIfContainsCoachInRootDirectory,
  checkIfContainsStudentInRootDirectory,
  checkIfContainsSolutionsInCoachDirectory,
  checkIfContainsResourcesInStudentDirectory,
  checkIfStudentPagesDoNotContainReferencesToCoachesPages
} = require('./check');
const {
  getAllDirectories
} = require('./check/utilities');

const getTestFunctions = (path) => {
  //store each check function & the appropriate error message
  const testFunctions = [
    {
      function: () => checkIfContainsReadmeInRootDirectory(path),
      errorMessage: 'Must contain a README.md file in the root directory.'
    },
    {
      function: () => checkIfContainsCoachInRootDirectory(path),
      errorMessage: 'Must contain a Coach directory in the root directory.'
    },
    {
      function: () => checkIfContainsStudentInRootDirectory(path),
      errorMessage: 'Must contain a Student directory in the root directory.'
    },
    {
      function: () => checkIfContainsSolutionsInCoachDirectory(path),
      errorMessage: 'Must contain a Solutions directory in the Coach directory.'
    },
    {
      function: () => checkIfContainsResourcesInStudentDirectory(path),
      errorMessage: 'Must contain a Resources directory in the Student directory.'
    },
    {
      function: () => checkIfStudentPagesDoNotContainReferencesToCoachesPages(path),
      errorMessage: 'Must not contain references from the Student pages to the Coach pages'
    }
  ];

  return testFunctions;
}

const getPaths = (shouldScanAllSubdirectories, inputPath) => {
  let paths = [];
  if (shouldScanAllSubdirectories) {
    core.debug(`Testing all validly named subdirectories of ${inputPath} to see if they conform to the WhatTheHack format...`);
    //only return directories that match the 'XXX-name' format
    const wthRegex = new RegExp('\\d{3}.*$');
    paths = fs.readdirSync(inputPath, { withFileTypes: true})
              .filter(directory => directory.isDirectory && wthRegex.test(directory.name))
              .map(directory => path.join(inputPath, directory.name));
  } else {
    paths.push(inputPath);
  }
  return paths;
}

const excludePathsToNotFailOn = (originalPaths, directoriesToNotFailOn) => {
  let newPaths = originalPaths;

  return newPaths;
}

const run = async () => {
  try {
    const shouldScanAllSubdirectories = JSON.parse(core.getInput('shouldScanAllSubdirectories'));
    const shouldExcludePathsToNotFailOn = JSON.parse(core.getInput('shouldExcludePathsToNotFailOn'));
    const pathToExcludePathsToNotFailOnConfigFile = core.getInput('pathToExcludePathsToNotFailOnConfigFile');
    const path = core.getInput('path');

    let paths = [];

    paths = getPaths(shouldScanAllSubdirectories, path);

    if(shouldExcludePathsToNotFailOn) {
      let pathsToNotFailOn = []
      pathsToNotFailOn = JSON.parse(fs.readFileSync(path.join(__dirname, pathToExcludePathsToNotFailOnConfigFile)));
      paths = excludePathsToNotFailOn(paths, pathsToNotFailOn.directoriesToNotFailOn);
    }

    let aggregateResults = [];

    paths.forEach(path => {
      core.info(`Checking ${path} for conformance to the WhatTheHack format...`);

      const testFunctions = getTestFunctions(path);

      //execute all check functions and store results
      const individualResults = testFunctions.map(x => (
        {
          result: x.function(),
          errorMessage: x.errorMessage
        }
      ));

      //if any of the results are false
      if (individualResults.some(x => !x.result)) {
        //print the output for each failed check
        individualResults.forEach(x => {
          if (!x.result) {
            core.error(x.errorMessage);
          }
        });
        
        aggregateResults.push({
          path: path,
          result: false
        });
      }
    });
    
    if(aggregateResults.some(x => !x.result)) {
      core.setFailed('Not all conditions satisfied');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = {
  run: run,
  getPaths: getPaths,
  excludePathsToNotFailOn: excludePathsToNotFailOn
}


