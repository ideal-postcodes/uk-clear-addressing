# UK Clear Addressing

This module converts UK address fragments into a properly formatted address recognised by Royal Mail according to its Clear Addressing Guidelines. This consists of 1-3 address lines, a post town line and a postcode line.

![Correct Addressing](https://github.com/cblanc/uk-clear-addressing/blob/master/misc/correct_address.gif?raw=true)

I believe I've covered all of the (many, many) edge cases with pretty much exhaustive testing

Originally created in conjunction with Royal Mail Postcode Address File, it maps field name for field name if you were to pull the address straight from this database. If you don't have access to PAF, it can still be used.


## Getting Started

Get it

`npm install uk-clear-addressing`

Test it

`npm test`

Try it

```javascript
var AddressModel = require('uk-clear-addressing');

// Pass in your address fragments

var address = new AddressModel({
	postcode: "OX14 4PG",
	post_town: "ABINGDON",
	dependant_locality: "", //Left in some blank parameters for illustrative purposes
	double_dependant_locality: "",
	thoroughfare: "ACACIA AVENUE",
	building_number: "1",
	building_name: "",
	sub_building_name: "",
	dependant_thoroughfare: ""
});

console.log(address.formattedAddress());

//
//
//
//
//
//
//
//

```
## Parameters

Below is a list of address fragments. For the address to be properly formatted, you need to pass in all the address fragments available to you

_Premises Elements_

- Sub Building Name (e.g. ‘Flat 1’) 
- Building Name (e.g. ‘Rose Cottage’)
- Building Number (e.g. ‘22’)
- Organisation Name (e.g. ‘Cath’s Cakes’)
- PO Box number

_Thoroughfare elements_

- Dependent Thoroughfare Name (e.g. ‘Cheshunt’)
- Dependent Thoroughfare Descriptor (e.g. ‘Mews’ or ‘Court’)
- Thoroughfare Name (e.g. ‘Cypress’)
- Thoroughfare Descriptor (e.g. ‘Road’ or ‘Street’)

_Locality elements_

- Double Dependent Locality (e.g. ‘Tyre Industrial Estate’)
- Dependent Locality (e.g. ‘Blantyre’)
- Post Town (e.g. ‘GLASGOW’)