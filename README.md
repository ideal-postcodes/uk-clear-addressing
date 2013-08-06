# UK Clear Addressing

This module converts UK address fragments into a properly formatted address recognised by Royal Mail according to its Clear Addressing Guidelines. This consists of 1-3 address lines, a post town line and a postcode line.

![Correct Addressing](https://raw.github.com/cblanc/uk-clear-addressing/master/misc/correct_address.gif)

Originally created in conjunction with Royal Mail Postcode Address File, it maps field name for field name if you were to pull the address straight from this database. If you don't have access to PAF, it can still be used as long as you know which parameters correspond to what data you have available. Parameters listed [below](#parameters)

For anyone who has tried this, properly formatting addresses to Royal Mail's standard is a bit of a nightmare because of all the edge cases. I've covered as many of them as I could find, these are documented in the test file.

## Getting Started

_Get it_

`npm install uk-clear-addressing`

_Test it_

`npm test`

_Try it_

```javascript
var AddressModel = require('uk-clear-addressing');

// Pass in your address fragments

var address = new AddressModel({
	postcode: "WS11 5SB",
	post_town: "CANNOCK",
	dependant_locality: "",
	double_dependant_locality: "",
	thoroughfare: "PYE GREEN ROAD",
	building_number: "",
	building_name: "FLOWER HOUSE 189A",
	sub_building_name: "",
	dependant_thoroughfare: "",
	organisation_name: "S D ALCOTT FLORISTS",
});

console.log(address.formattedAddress());

// Lo and behold...
//  { 
//		postcode: 'WS11 5SB',
//  	post_town: 'CANNOCK',
//  	line_1: 'S D Alcott Florists',
//	  line_2: 'Flower House',
//  	line_3: '189a Pye Green Road' 
//	}
//

```
## Parameters

Below is a list of address fragments. For the address to be properly formatted, you need to pass in all the address fragments available to you.

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