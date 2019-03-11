# Changelog

## [2.2.0] 2019-03-11

- Standardise project with prettier and @cablanchard/tslint
- Use stardardised compile options from @cablanchard/tsconfig

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
