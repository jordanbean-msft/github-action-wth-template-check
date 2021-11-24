# WhatTheHack Template Checker GitHub Action

<p align="center">
  <a href="https://github.com/jordanbean-msft/github-action-wth-template-check/actions"><img alt="javscript-action status" src="https://github.com/jordanbean-msft/github-action-wth-template-check/workflows/units-test/badge.svg"></a>
</p>

This GitHub Action takes an input directory and checks to see if it conforms to the WhatTheHack [standard format](https://microsoft.github.io/WhatTheHack/000-HowToHack/WTH-HowToAuthorAHack.html).

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: jordanbean-msft/github-action-wth-template-check@v1
with:
  inputDir: ${{ github.workspace }}/047-Dapr
```
