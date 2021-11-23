const core = require('@actions/core');
const {
  checkIfContainsReadmeInRootDirectory,
  checkIfContainsCoachInRootDirectory,
  checkIfContainsStudentInRootDirectory,
  checkIfContainsSolutionsInCoachDirectory,
  checkIfContainsResourcesInStudentDirectory
} = require('./check');

let run = async () => {
  try {
    const inputPath = core.getInput('inputPath');

    //store each check function & the appropriate error message
    const testFunctions = [
      {
        function: () => checkIfContainsReadmeInRootDirectory(inputPath),
        errorMessage: 'Does not contain a README.md file in the root directory.'
      },
      {
        function: () => checkIfContainsCoachInRootDirectory(inputPath),
        errorMessage: 'Does not contain a Coach directory in the root directory.'
      },
      {
        function: () => checkIfContainsStudentInRootDirectory(inputPath),
        errorMessage: 'Does not contain a Student directory in the root directory.'
      },
      {
        function: () => checkIfContainsSolutionsInCoachDirectory(inputPath),
        errorMessage: 'Does not contain a Solutions directory in the Coach directory.'
      },
      {
        function: () => checkIfContainsResourcesInStudentDirectory(inputPath),
        errorMessage: 'Does not contain a Resources directory in the Student directory.'
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
      const errorMessage = 'Not all conditions satisfied'
      console.log(errorMessage);
      core.setFailed(errorMessage);

      //print the output for each failed check
      results.forEach(x => {
        if (!x.result) {
          console.log(x.errorMessage);
        }
      })
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
