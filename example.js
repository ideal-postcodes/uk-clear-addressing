const { Address } = require("uk-clear-addressing");

const address = new Address({
  postcode: "WS11 5SB",
  post_town: "CANNOCK",
  thoroughfare: "Pye Green Road",
  building_name: "Flower House 189A",
  organisation_name: "S D Alcott Florists",
});

console.log(address.formattedAddress());

const { line_1, line_2, line_3, post_town, postcode, premise } = address;
