const core = require('@actions/core');
const checkIfContainsReadmeInRootDirectory = require('./check/check');

let run = async() => {
  try {
    const inputPath = core.getInput('inputPath');
    checkIfContainsReadmeInRootDirectory(inputPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
