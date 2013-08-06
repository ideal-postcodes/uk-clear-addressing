# Ideal Postcodes jQuery Plugin

Add UK Address lookups using postcodes on any address form using Royal Mail's addressing database

This plugin is the fastest way to integrate Ideal Postcodes' UK lookup API on a user data entry form.

jQuery.postcodes generates 2 form elements within a specified div element. These are an input field to receive postcode inputs from the user and a button to run address lookups via the Ideal Postcodes API.

If a matching is found, a selection menu is created and the selected address is piped into the form.

If no matching postcode is found or an error occurred, the plugin will append an appropriate message.


## Getting Started
Install with npm install uk-clear-addressing

```javascript
var AddressModel = require('uk-clear-addressing');

```

## Documentation
Documentation can be found [here](https://ideal-postcodes.co.uk/documentation)