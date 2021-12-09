const path = require('path');
const fs = require('fs');
const core = require('@actions/core');
const markdownLinkExtractor = require('markdown-link-extractor');
const {
  getAllFilePathsWithExtension
} = require('./utilities')

module.exports = {
  checkIfLhsPagesDoNotContainReferencesToRhsPages: (inputPath, lhsPageDirectory, rhsPageDirectory) => {
    core.debug(`Checking if ${lhsPageDirectory} contains a reference to the ${rhsPageDirectory} in the ${inputPath} directory...`)
    const markdownFilePaths = getAllFilePathsWithExtension(inputPath, 'md');
    const lhsPageDirectoryPath = path.join(inputPath, lhsPageDirectory);

    //get all file paths under the lhs directory
    const lhsPageFilePaths = markdownFilePaths.filter(file => RegExp(`^${lhsPageDirectoryPath}`).test(file));

    const pagesWithReferencesToRhsDirectory = []

    lhsPageFilePaths.forEach(filePath => {
      const fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'});

      const links = markdownLinkExtractor(fileContent, true);

      //check to see if there are any references to the rhs directory (ex. ../Coach/Solution-00.md)
      const linksWithReferencesToRhsPages = links.filter(link => RegExp(`.{2}/${rhsPageDirectory}/`).test(link.href));

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
  }
}