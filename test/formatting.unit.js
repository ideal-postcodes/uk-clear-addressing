"use strict";

const { assert } = require("chai");
const Address = require("../lib/index.js");

const address_test_battery = (sample, expected) => {
	const address = new Address(sample);
	const formatted_address = address.formattedAddress();
	assert.equal(formatted_address.line_1, expected.line_1);
  assert.equal(formatted_address.line_2, expected.line_2);
  assert.equal(formatted_address.line_3, expected.line_3);
  assert.equal(formatted_address.postcode, expected.postcode);
  assert.equal(formatted_address.post_town, expected.post_town);
  assert.equal(formatted_address.premise, expected.premise);
};

describe("Formatted Addresses", () => {
	let sample, expected;

	it ("should cache formatted addresses", () => {
		sample = {
			postcode: "OX14 4PG",
			post_town: "ABINGDON",
			dependant_locality: "Appleford",
			double_dependant_locality: "",
			thoroughfare: "",
			building_number: "",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "Leda Engineering Ltd",
			department_name: "",
			UDPRN: ""
		};

		const address = new Address(sample);
		const formattedAddress = address.formattedAddress();
		assert.equal(address.cache, formattedAddress);
	});

	describe("Rule 1", () => {
		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "Appleford",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "Leda Engineering Ltd",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Leda Engineering Ltd",
				line_2: "Appleford",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: ""
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "Appleford",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "Leda Engineering Ltd",
				department_name: "Engineering Department",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Leda Engineering Ltd",
				line_2: "Engineering Department",
				line_3: "Appleford",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: ""
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 2", () => {
		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Acacia Avenue",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "1 Acacia Avenue",
				line_2: "",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "Locality Name",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "1 Locality Name",
				line_2: "",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "Locality Name",
				double_dependant_locality: "Dep Locality Name",
				thoroughfare: "",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "1 Dep Locality Name",
				line_2: "Locality Name",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "Locality Name",
				double_dependant_locality: "Dep Locality Name",
				thoroughfare: "Acacia Avenue",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "1 Acacia Avenue",
				line_2: "Dep Locality Name",
				line_3: "Locality Name",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 3", () => {
		it ("should return the correct address format", () => {
			sample = {
				postcode: "NR25 7HG",
				post_town: "HOLT",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Station Road",
				building_number: "",
				building_name: "1A",
				sub_building_name: "",
				dependant_thoroughfare: "Seastone Court",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "1a Seastone Court",
				line_2: "Station Road",
				line_3: "",
				post_town: "HOLT",
				postcode: "NR25 7HG",
				premise: "1a"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "CV8 2UE",
				post_town: "KENILWORTH",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Cotton Drive",
				building_number: "",
				building_name: "Unit 3-4",
				sub_building_name: "",
				dependant_thoroughfare: "Dalehouse Lane Industrial Estate",
				organisation_name: "Imperial Candles",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Imperial Candles",
				line_2: "Unit 3-4",
				line_3: "Dalehouse Lane Industrial Estate, Cotton Drive",
				post_town: "KENILWORTH",
				postcode: "CV8 2UE",
				premise: "Unit 3-4"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "RH6 0HP",
				post_town: "HORLEY",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Upper Hill",
				building_number: "",
				building_name: "The Manor",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "The Manor",
				line_2: "Upper Hill",
				line_3: "",
				post_town: "HORLEY",
				postcode: "RH6 0HP",
				premise: "The Manor"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "WS11 5SB",
				post_town: "CANNOCK",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Pye Green Road",
				building_number: "",
				building_name: "Flower House 189A",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "S D Alcott Florists",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "S D Alcott Florists",
				line_2: "Flower House",
				line_3: "189a Pye Green Road",
				post_town: "CANNOCK",
				postcode: "WS11 5SB",
				premise: "Flower House, 189a"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "ME16 0LP",
				post_town: "GRAFTON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "St. Laurence Avenue",
				building_number: "",
				building_name: "Centre 30",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "James Villa Holidays",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "James Villa Holidays",
				line_2: "Centre 30",
				line_3: "St. Laurence Avenue",
				post_town: "GRAFTON",
				postcode: "ME16 0LP",
				premise: "Centre 30"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 4", () => {
		it ("RULE 4: should return the correct address format", () => {
			sample = {
				postcode: "BH23 6AA",
				post_town: "CHRISTCHURCH",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "The Street",
				building_number: "15",
				building_name: "Victoria House",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Victoria House",
				line_2: "15 The Street",
				line_3: "",
				post_town: "CHRISTCHURCH",
				postcode: "BH23 6AA",
				premise: "Victoria House, 15"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 5", () => {
		it ("RULE 5: should return the correct address format", () => {
			sample = {
				postcode: "BS8 4AB",
				post_town: "BRISTOL",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Lime Tree Avenue",
				building_number: "12",
				building_name: "",
				sub_building_name: "Flat 1",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Flat 1",
				line_2: "12 Lime Tree Avenue",
				line_3: "",
				post_town: "BRISTOL",
				postcode: "BS8 4AB",
				premise: "Flat 1, 12"
			};

			address_test_battery(sample, expected);
		});

		it ("RULE 5: should return the correct address format", () => {
			sample = {
				postcode: "SP5 4NA",
				post_town: "SALISBURY",
				dependant_locality: "Coombe Bissett",
				double_dependant_locality: "",
				thoroughfare: "High Street North",
				building_number: "12",
				building_name: "",
				sub_building_name: "A",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "12A High Street North",
				line_2: "Coombe Bissett",
				line_3: "",
				post_town: "SALISBURY",
				postcode: "SP5 4NA",
				premise: "12A"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 6", () => {
		it ("should return the correct address format", () => {
			sample = {
				postcode: "B6 5BA",
				post_town: "BIRMINGHAM",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Estone Walk",
				building_number: "",
				building_name: "Barry Jackson Tower",
				sub_building_name: "10B",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "10B Barry Jackson Tower",
				line_2: "Estone Walk",
				line_3: "",
				post_town: "BIRMINGHAM",
				postcode: "B6 5BA",
				premise: "10B Barry Jackson Tower"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "BS1 2AW",
				post_town: "BRISTOL",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "High Street West",
				building_number: "",
				building_name: "110-114",
				sub_building_name: "Caretakers Flat",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Caretakers Flat",
				line_2: "110-114 High Street West",
				line_3: "",
				post_town: "BRISTOL",
				postcode: "BS1 2AW",
				premise: "Caretakers Flat, 110-114"
			};

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", () => {
			sample = {
				postcode: "RH6 0HP",
				post_town: "HORLEY",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "Upper Hill",
				building_number: "",
				building_name: "The Manor",
				sub_building_name: "Stables Flat",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Stables Flat",
				line_2: "The Manor",
				line_3: "Upper Hill",
				post_town: "HORLEY",
				postcode: "RH6 0HP",
				premise: "Stables Flat, The Manor"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Weird rule", () => {
		it ("Weird Rule: should return the correct address format", () => {
			sample = {
				postcode: "EH4 3AJ",
			  post_town: "EDINBURGH",
			  dependant_locality: "",
			  double_dependant_locality: "",
			  thoroughfare: "Belgrave Crescent",
			  dependant_thoroughfare: "",
			  building_number: " ",
			  building_name: "",
			  sub_building_name: "20gf",
			  po_box: "",
			  department_name: "",
			  organisation_name: "",
			  udprn: 8224574,
			  postcode_type: "S",
			  su_organisation_indicator: " ",
			  delivery_point_suffix: "1F",
			  postcode_inward: "3AJ",
			  postcode_outward: "EH4",
			  county: null,
			  country: "Scotland",
			  district: "City of Edinburgh",
			  ward: "Inverleith",
			  eastings: 323988,
			  northings: 674105,
			  longitude: -3.21889755918115,
			  latitude: 55.95393929845 
			};
			
			expected = {
				line_1: "20gf Belgrave Crescent",
				line_2: "",
				line_3: "",
				post_town: "EDINBURGH",
				postcode: "EH4 3AJ",
				premise: "20gf"
			};

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 7", () => {
		it ("RULE 7: should return the correct address format", () => {
			sample = {
				postcode: "SO23 9AP",
				post_town: "WINCHESTER",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "John Street",
				building_number: "27",
				building_name: "The Tower",
				sub_building_name: "2B",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "2B The Tower",
				line_2: "27 John Street",
				line_3: "",
				post_town: "WINCHESTER",
				postcode: "SO23 9AP",
				premise: "2B The Tower, 27"
			};

			address_test_battery(sample, expected);
		});

		it ("RULE 7: should return the correct address format", () => {
			sample = {
				postcode: "BP23 6AA",
				post_town: "CORYTON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "The Street",
				building_number: "15",
				building_name: "Victoria House",
				sub_building_name: "Basement Flat",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			};
			
			expected = {
				line_1: "Basement Flat",
				line_2: "Victoria House",
				line_3: "15 The Street",
				post_town: "CORYTON",
				postcode: "BP23 6AA",
				premise: "Basement Flat, Victoria House, 15"
			};

			address_test_battery(sample, expected);
		});
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "B39 0DH",
			post_town: "BIRMINGHAM",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "Packhouse Lane",
			building_number: "",
			building_name: "Rose Cottage",
			sub_building_name: "(Smith)",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "(Smith)",
			line_2: "Rose Cottage",
			line_3: "Packhouse Lane",
			post_town: "BIRMINGHAM",
			postcode: "B39 0DH",
			premise: "(Smith), Rose Cottage"
		};

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "S64 5BB",
			post_town: "BRADLEY HEATH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "Crompton Road",
			building_number: "",
			building_name: "(Hynes)",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "(Hynes)",
			line_2: "Crompton Road",
			line_3: "",
			post_town: "BRADLEY HEATH",
			postcode: "S64 5BB",
			premise: "(Hynes)"
		};

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "KT6 5BT",
			post_town: "BRADOCK",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "Vixen Road",
			building_number: "16",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "16 Vixen Road",
			line_2: "",
			line_3: "",
			post_town: "BRADOCK",
			postcode: "KT6 5BT",
			premise: "16"
		};

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "P01 1AF",
			post_town: "PORTSMOUTH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "High Street",
			building_number: "",
			building_name: "Victoria House",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "Cath's Cakes",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "Cath's Cakes",
			line_2: "Victoria House",
			line_3: "High Street",
			post_town: "PORTSMOUTH",
			postcode: "P01 1AF",
			premise: "Victoria House"
		};

		address_test_battery(sample, expected);	
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "TN27 8BT",
			post_town: "ASHFORD",
			dependant_locality: "Biddenden",
			double_dependant_locality: "",
			thoroughfare: "Oak Avenue",
			building_number: "0",
			building_name: "Holly House",
			sub_building_name: "Flat 1",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "Flat 1, Holly House",
			line_2: "Oak Avenue",
			line_3: "Biddenden",
			post_town: "ASHFORD",
			postcode: "TN27 8BT",
			premise: "Flat 1, Holly House"
		};
		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "BH23 6AA",
			post_town: "CHRISTCHURCH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "The Street",
			building_number: "15",
			building_name: "Victoria House",
			sub_building_name: "Flat 20",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "Flat 20",
			line_2: "Victoria House",
			line_3: "15 The Street",
			post_town: "CHRISTCHURCH",
			postcode: "BH23 6AA",
			premise: "Flat 20, Victoria House, 15"
		};
		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "BS1 2AW",
			post_town: "BRISTOL",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "High Street West",
			building_number: "",
			building_name: "110-114",
			sub_building_name: "Caretakers Flat",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "Caretakers Flat",
			line_2: "110-114 High Street West",
			line_3: "",
			post_town: "BRISTOL",
			postcode: "BS1 2AW",
			premise: "Caretakers Flat, 110-114"
		};

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "NR25 7HG",
			post_town: "EMSWORTH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "Angelica Way",
			thoroughfare_descriptor: "Way",
			building_number: "16",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "16 Angelica Way",
			line_2: "",
			line_3: "",
			post_town: "EMSWORTH",
			postcode: "NR25 7HG",
			premise: "16"
		};

		address_test_battery(sample, expected);
	});

	it ("should return the correct address format", () => {
		sample = {
			postcode: "OX1 2AY",
			post_town: "OXFORD",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "George Street",
			building_number: "37",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "O'Neills",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "O'Neills",
			line_2: "37 George Street",
			line_3: "",
			post_town: "OXFORD",
			postcode: "OX1 2AY",
			premise: "37"
		};

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", () => {
		sample = {
			postcode: "RH6 0HP",
			post_town: "HORLEY",
			dependant_locality: "Norwood",
			double_dependant_locality: "",
			thoroughfare: "",
			building_number: "",
			building_name: "The Manor",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		};
		
		expected = {
			line_1: "The Manor",
			line_2: "Norwood",
			line_3: "",
			post_town: "HORLEY",
			postcode: "RH6 0HP",
			premise: "The Manor"
		};

		address_test_battery(sample, expected);
	});

	it ("should return the correct address format", () => {
		sample = {
			postcode: "PO14 1UX",
			post_town: "FAREHAM",
			po_box: "61"
		};
		
		expected = {
			line_1: "PO Box 61",
			line_2: "",
			line_3: "",
			post_town: "FAREHAM",
			postcode: "PO14 1UX",
			premise: "PO Box 61"
		};

		address_test_battery(sample, expected);
	});

	it ("should format addresses with more than 3 lines as a comma separated line 3", () => {
		sample = {
			"dependant_locality": "Britannia Enterprise Park",
			"postcode_type": "S",
			"po_box": "",
			"post_town": "LICHFIELD",
			"delivery_point_suffix": "2G",
			"double_dependant_locality": "",
			"su_organisation_indicator": "Y",
			"longitude": -1.80159904530495,
			"department_name": "",
			"district": "Lichfield",
			"building_name": "Unit 60",
			"dependant_thoroughfare": "",
			"northings": 309710,
			"postcode_outward": "WS14",
			"postcode_inward": "9UY",
			"sub_building_name": "",
			"eastings": 413509,
			"postcode": "WS14 9UY",
			"udprn": 27027512,
			"line_3": "Britannia Way",
			"organisation_name": "Britannia Park Veterinary Centre",
			"ward": "Boley Park",
			"county": "Staffordshire",
			"line_1": "Britannia Park Veterinary Centre",
			"building_number": " ",
			"thoroughfare": "Britannia Way",
			"line_2": "Unit 60",
			"latitude": 52.6849198703419
		};
		
		expected = {
			line_1: "Britannia Park Veterinary Centre",
			line_2: "Unit 60",
			line_3: "Britannia Way, Britannia Enterprise Park",
			post_town: "LICHFIELD",
			postcode: "WS14 9UY",
			premise: "Unit 60"
		};

		address_test_battery(sample, expected);
	});
});
