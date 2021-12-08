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
  getPaths,
  excludePathsToNotFailOn
} = require('./check/utilities')

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

const run = async () => {
  try {
    const shouldScanSubdirectories = JSON.parse(core.getInput('shouldScanSubdirectories'));
    core.debug(`Value of shouldScanSubdirectories: ${shouldScanSubdirectories}`);
    const pathToExcludePathsToNotFailOnConfigFile = core.getInput('pathToExcludePathsToNotFailOnConfigFile');
    core.debug(`Value of pathToExcludePathsToNotFailOnConfigFile: ${pathToExcludePathsToNotFailOnConfigFile}`);
    const inputPath = core.getInput('path');
    core.debug(`Value of path: ${inputPath}`);

    let paths = [];

    paths = getPaths(shouldScanSubdirectories, inputPath);

    if(pathToExcludePathsToNotFailOnConfigFile) {
      let pathsToNotFailOn = []
      pathsToNotFailOn = fs.readFileSync(path.join(__dirname, pathToExcludePathsToNotFailOnConfigFile), 'utf-8').split("\n");
      paths = excludePathsToNotFailOn(paths, pathsToNotFailOn);
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
