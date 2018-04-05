# Changelog

## [2.0.0] 2018-04-05

### Breaking Changes

- Node.js 6.x and above supported only
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
