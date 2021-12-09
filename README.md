# WhatTheHack Template Checker GitHub Action

<p align="center">
  <a href="https://github.com/jordanbean-msft/github-action-wth-template-check/actions"><img alt="javscript-action status" src="https://github.com/jordanbean-msft/github-action-wth-template-check/workflows/units-test/badge.svg"></a>
</p>

This GitHub Action takes an input directory and checks to see if it conforms to the WhatTheHack [standard format](https://microsoft.github.io/WhatTheHack/000-HowToHack/WTH-HowToAuthorAHack.html).

## Usage

**Run on just one directory**
```yaml
name: Template Format Check
uses: jordanbean-msft/github-action-wth-template-check@v0.2.0
with:
  path: ${{ github.workspace }}/047-Dapr
```

**Run on entire WTH repo**
```yaml
name: Template Format Check
uses: jordanbean-msft/github-action-wth-template-check@v0.2.0
with:
  path: ${{ github.workspace }}
  shouldScanSubdirectories: true
  pathToExcludePathsToNotFailOnConfigFile: ${{ github.workspace }}/.github/workflows/.excludePathsToNotFailOnConfigFile.txt
```

Example log output.

```
Run jordanbean-msft/github-action-wth-template-check@v0.2.0
Checking /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr for conformance to the WhatTheHack format...
Checking to see if README.md is in root of directory /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Checking to see if Coach directory in in root of directory /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Checking to see if Student directory is in root of directory /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Checking to see if Solutions directory is in Coach directory of /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Checking to see if Resources directory is in Student directory of /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Checking to see if any Student pages link to any Coach pages in /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr ...
Error: The following Student page contains a reference to the Coach directory: /home/runner/work/WhatTheHack/WhatTheHack/047-Dapr/Student/Challenge-01.md
Error:   ![asdf](../Coach/Solution-00.md)
Error: Must not contain references from the Student pages to the Coach pages
Error: Not all conditions satisfied
```
