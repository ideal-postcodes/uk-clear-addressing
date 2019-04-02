<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/UK%20Clear%20Addressing%20Logo@3x.png" alt="UK Clear Addressing">
</h1>

> Correctly parse and format UK Addresses in Royal Mail's Postcode Address File

[![CircleCI](https://circleci.com/gh/ideal-postcodes/uk-clear-addressing.svg?style=svg)](https://circleci.com/gh/ideal-postcodes/uk-clear-addressing)
[![Dependency Status](https://david-dm.org/ideal-postcodes/uk-clear-addressing.png)](https://david-dm.org/ideal-postcodes/uk-clear-addressing)
[![Coverage Status](https://coveralls.io/repos/github/ideal-postcodes/uk-clear-addressing/badge.svg?branch=master)](https://coveralls.io/github/ideal-postcodes/uk-clear-addressing?branch=master)
[![Try uk-clear-addressing on RunKit](https://badge.runkitcdn.com/uk-clear-addressing.svg)](https://npm.runkit.com/uk-clear-addressing)

Parses Postcode Address File records into correctly formatted address recognised by Royal Mail according to its Clear Addressing Guidelines.

Produces consistent address lines, a post town line and a postcode line.

## Features

![Correct Addressing](https://img.ideal-postcodes.co.uk/correct_address.gif)

- Correctly format UK addresses using Royal Mail's Postcode Address File
- Produces 3 address lines and premise attributes based on `building_name`, `sub_building_name` and `building_number`
- Address sorting function
- Extensive test suite

## Links

- [API Documentation](https://ideal-postcodes.github.io/uk-clear-addressing/)
- [More information on Postcode Address File data attributes](https://ideal-postcodes.co.uk/documentation/paf-data)
- [PAF Programmer's Guide](https://js.ideal-postcodes.co.uk/guide.pdf)
- [Try uk-clear-addressing on RunKit](https://npm.runkit.com/uk-clear-addressing)

## Getting Started

### Installation

```bash
npm install uk-clear-addressing
```

### Formatting Addresses

#### Extract formatted address lines

```javascript
const { Address } = require('uk-clear-addressing');

const pafRecord = {
  postcode: "WS11 5SB",
  post_town: "CANNOCK",
  thoroughfare: "Pye Green Road",
  building_name: "Flower House 189A",
  organisation_name: 'S D Alcott Florists',
};

const {
  line_1,
  line_2,
  line_3,
  premise,
  post_town,
  postcode
} = new Address(pafRecord);
```

#### Extract a formatted address object

```javascript
const { Address } = require('uk-clear-addressing');

const address = new Address({
  postcode: "WS11 5SB",
  post_town: "CANNOCK",
  thoroughfare: "Pye Green Road",
  building_name: "Flower House 189A",
  organisation_name: 'S D Alcott Florists',
});

console.log(address.formattedAddress());
//  {
//    postcode: 'WS11 5SB',
//    post_town: 'CANNOCK',
//    line_1: 'S D Alcott Florists',
//    line_2: 'Flower House',
//    line_3: '189a Pye Green Road',
//    premise: "Flower House, 189a"
//  }
```

### Sorting Addresses

`Address.sort` implements a comparison function, which allows you to compare `Address` instances. This can readily be passed into `Array.prototype.sort`

```javascript
const addresses = await query("SELECT * FROM postcode_address_file LIMIT 10");

addresses
  .map(address => new Address(address)) // Instantiate an `Address` instances
  .sort(Address.sort)                   // Now sort
  // Print an example to console
  .forEach(address => console.log(address.line_1));
  // "190 Elm Road"
  // "190a Elm Road"
  // "191 Elm Road"
  // "191a Elm Road"
  // "192 Elm Road"
  // "193 Elm Road"
  // "193a Elm Road"
  // "197 Elm Road"
  // "197a Elm Road"
  // "199 Elm Road"
```

## Testing

Many of the regular and edge cases are documented in the test. To run the test suite:

```bash
npm test
```

If you find an edge case, please feel free to make a pull request. However be sure to include a test which documents the specific case being handled.

## Parameters

Below is a list of address fragments. For the address to be properly formatted, you need to pass in all the address fragments available to you.

### Premises Elements

- Sub Building Name (e.g. ‘Flat 1’) 
- Building Name (e.g. ‘Rose Cottage’)
- Building Number (e.g. ‘22’)
- Organisation Name (e.g. ‘Cath’s Cakes’)
- PO Box number

### Thoroughfare Elements

- Dependant Thoroughfare Name (e.g. ‘Cheshunt’)
- Dependant Thoroughfare Descriptor (e.g. ‘Mews’ or ‘Court’)
- Thoroughfare Name (e.g. ‘Cypress’)
- Thoroughfare Descriptor (e.g. ‘Road’ or ‘Street’)

### Locality Elements

- Double Dependant Locality (e.g. ‘Tyre Industrial Estate’)
- Dependant Locality (e.g. ‘Blantyre’)
- Post Town (e.g. ‘GLASGOW’)

## Licence

MIT

