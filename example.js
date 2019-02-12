const { Address } = require("uk-clear-addressing");

const address = new Address({
  postcode: "WS11 5SB",
  post_town: "CANNOCK",
  dependant_locality: "",
  double_dependant_locality: "",
  thoroughfare: "Pye Green Road",
  building_number: "",
  building_name: "Flower House 189A",
  sub_building_name: "",
  dependant_thoroughfare: "",
  organisation_name: "S D Alcott Florists"
});

console.log(address.formattedAddress());
