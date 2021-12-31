# [4.2.0](https://github.com/ideal-postcodes/uk-clear-addressing/compare/4.1.1...4.2.0) (2021-12-31)


### Features

* **Sort:** Export pure sort scoring method ([2e6b9de](https://github.com/ideal-postcodes/uk-clear-addressing/commit/2e6b9def89c4079df5835c751a9291f33003fa41))

## [4.1.1](https://github.com/ideal-postcodes/uk-clear-addressing/compare/4.1.0...4.1.1) (2021-11-17)


### Bug Fixes

* **Sub + Building Name:** Detect address range ([cbffe30](https://github.com/ideal-postcodes/uk-clear-addressing/commit/cbffe306d3d9fff28fac958acebaaa480acc85f4))

# [4.1.0](https://github.com/ideal-postcodes/uk-clear-addressing/compare/4.0.0...4.1.0) (2021-05-17)


### Features

* **Sort:** Export sorting attributes ([f0625f4](https://github.com/ideal-postcodes/uk-clear-addressing/commit/f0625f415b24175b5f207dc985c740ff167daa9d))

# [4.0.0](https://github.com/ideal-postcodes/uk-clear-addressing/compare/3.0.0...4.0.0) (2021-03-05)


### Bug Fixes

* **Release:** Trigger release ([764d1e4](https://github.com/ideal-postcodes/uk-clear-addressing/commit/764d1e4c33c505ac2445e89ba8ba78939cdc72b1))


### Documentation

* **Premise Attributes:** Document number and unit ([a363dc9](https://github.com/ideal-postcodes/uk-clear-addressing/commit/a363dc9f062849b254536066917f568f3b1f39d5))


### Features

* **Building Numbers:** Experimental attempt at returning actual ([0f653e9](https://github.com/ideal-postcodes/uk-clear-addressing/commit/0f653e99af741109b7915bb30071293e3252f411))
* **Building Units:** Experimental attempt at returning a building unit ([e72d7c4](https://github.com/ideal-postcodes/uk-clear-addressing/commit/e72d7c4945abc85006708686dd724355061beb10))
* **ES Module:** Add ESM build ([e6b5632](https://github.com/ideal-postcodes/uk-clear-addressing/commit/e6b5632f11163bec68943fbe6f1beced2fdd6a07))


### BREAKING CHANGES

* **Premise Attributes:** - formattedADdress now returns `unit` and `number`
- FormattedPremise interface includes `unit` and `number`

# [3.0.0](https://github.com/ideal-postcodes/uk-clear-addressing/compare/2.2.2...3.0.0) (2020-12-10)


### Bug Fixes

* **Semantic Release:** Automate npm release ([06ff64f](https://github.com/ideal-postcodes/uk-clear-addressing/commit/06ff64f958166adbe2fb43c2a94c44c04204f301))


### chore

* **Node:** Drop explicit support for Node 8 ([195cc59](https://github.com/ideal-postcodes/uk-clear-addressing/commit/195cc59203c4001ac4b44d0e2232c80b9a7b9077))
* **Node:** Drop support for node 8, add 14 ([e69e64d](https://github.com/ideal-postcodes/uk-clear-addressing/commit/e69e64d130225c654ef0fcd5e4c47f219935db96))


### BREAKING CHANGES

* **Node:** Node 8 no longer supported
* **Node:** Node 8 no longer forms part of CI testing

# Changelog

## [2.2.2] 2019-04-24

- Update dependencies
- Update documentation
  - Reference PAF API
  - Reference typedocs

## [2.2.1] 2019-04-02

- Fix: Handle building names that contain range on rule 6

## [2.2.0] 2019-03-11

- Formatting updates with guidance and examples outlined in the latest PAF Programmers Guide (Edition 7, Version 6):
  - Where a building name exception exists in rule 3, these names are no longer lower cased as documented in Table 27a. They now adhere to the (conflicting) example defined in Table 22
  - Building ranges which contain specific prefixes (e.g. Back of, Stalls, Maisonette) are no longer broken up across lines
- Added `line_1`, `line_2`, `line_3` and `premise` accessor methods on `Address` instances
- Standardise project with prettier and @cablanchard/tslint
- Use stardardised compile options from @cablanchard/tsconfig
- Added benchmark suite

## [2.1.2] 2019-02-12

- Add runkit example
- Use whitelist to generate npm package

## [2.1.1] 2018-07-02

- Fix: Drop nyc_output from npm package

## [2.1.0] 2018-06-28

- Project reorganisation
	- Typescript files omitted from npm package
	- Compiled js and typing files omitted from project repository
	- Moved compiled files to `dist/`
	- Dropped unused assets from npm module
- Fix: typings for `Address.sort` (previously returned inappropriate type)
- Fix: address sort comparator
- Fix: formatting for corner case on rule6

## [2.0.0] 2018-04-05

### Breaking Changes

- Node.js 6.x and above supported only
- Premise elements are no longer capitalised by default. PAF data should be appropriately capitalised
- Address class must be extracted from the library. E.g.

```
// New method of retrieving class

const { Address } = require("uk-clear-addressing");

```

### Other Changes

- `Address.sort` implements a sorting method which allows two `address` objects to be compared
- This project has been ported to typescript. Typings now available

## [0.1.2] 2014-12-05
- formattedAddress() now returns a premise attribute. This is a computed attribute to isolate the premise name taking into account all available information.

## [0.1.1] 2014-12-05
- Added fallback for 4 line addresses (very rare edge case): When an address spills over 3 lines, the remaining lines (lines 4 or more) are appended to line 3 and separated by commas
- Added fallback for address with only a sub_building_name (very rare edge case): See `weirdRule` in index.js
- Performance Improvement: Result of formattedAddress is cached
- Performance Improvement: Removal of string dependency
