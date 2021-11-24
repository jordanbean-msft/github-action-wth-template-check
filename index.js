const core = require('@actions/core');
const {
  checkIfContainsReadmeInRootDirectory,
  checkIfContainsCoachInRootDirectory,
  checkIfContainsStudentInRootDirectory,
  checkIfContainsSolutionsInCoachDirectory,
  checkIfContainsResourcesInStudentDirectory,
  checkIfStudentPagesDoNotContainReferencesToCoachesPages
} = require('./check');

let run = async () => {
  try {
    const inputPath = core.getInput('inputPath');
    
    core.info(`Checking ${inputPath} for conformance to the WhatTheHack format...`);
    
    //store each check function & the appropriate error message
    const testFunctions = [
      {
        function: () => checkIfContainsReadmeInRootDirectory(inputPath),
        errorMessage: 'Must contain a README.md file in the root directory.'
      },
      {
        function: () => checkIfContainsCoachInRootDirectory(inputPath),
        errorMessage: 'Must contain a Coach directory in the root directory.'
      },
      {
        function: () => checkIfContainsStudentInRootDirectory(inputPath),
        errorMessage: 'Must contain a Student directory in the root directory.'
      },
      {
        function: () => checkIfContainsSolutionsInCoachDirectory(inputPath),
        errorMessage: 'Must contain a Solutions directory in the Coach directory.'
      },
      {
        function: () => checkIfContainsResourcesInStudentDirectory(inputPath),
        errorMessage: 'Must contain a Resources directory in the Student directory.'
      },
      {
        function: () => checkIfStudentPagesDoNotContainReferencesToCoachesPages(inputPath),
        errorMessage: 'Must not contain references from the Student pages to the Coach pages'
      }
    ];

    //execute all check functions and store results
    const results = testFunctions.map(x => (
      {
        result: x.function(),
        errorMessage: x.errorMessage
      }
    ));

    //if any of the results are false
    if (results.some(x => !x.result)) {
      //print the output for each failed check
      results.forEach(x => {
        if (!x.result) {
          core.error(x.errorMessage);
        }
      });

      core.setFailed('Not all conditions satisfied');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
