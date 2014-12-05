var assert = require('chai').assert;
var	Address = require('../lib/index.js');

var address_test_battery = function(sample, expected) {
	address = new Address(sample);
	var formatted_address = address.formattedAddress();
	assert.equal(formatted_address.line_1, expected.line_1);
  assert.equal(formatted_address.line_2, expected.line_2);
  assert.equal(formatted_address.line_3, expected.line_3);
  assert.equal(formatted_address.postcode, expected.postcode);
  assert.equal(formatted_address.post_town, expected.post_town);
  assert.equal(formatted_address.premise, expected.premise);
};

describe("Building name exception test", function () {
	it ("should be true", function () {
		sample = {
			building_name: "12A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "100:1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1to1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "a"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "1a"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {
		sample = {
			building_name: "11A"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	
	// SHOULD THIS BE A CONSIDERATION? PLAIN DIGITS?
	//
	it ("should be true", function () {  
		sample = {
			building_name: "1"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	
	it ("should be true", function () {  
		sample = {
			building_name: "10"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
	it ("should be true", function () {  
		sample = {
			building_name: "100"
		};
		address = new Address(sample);
		assert.equal(address.buildingNameException(), true);
	});
});

describe("Formatted Addresses", function () {
	var sample, expected;

	it ("should cache formatted addresses", function () {
		sample = {
			postcode: "OX14 4PG",
			post_town: "ABINGDON",
			dependant_locality: "APPLEFORD",
			double_dependant_locality: "",
			thoroughfare: "",
			building_number: "",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "LEDA ENGINEERING LTD",
			department_name: "",
			UDPRN: ""
		}

		var address = new Address(sample);
		var	formattedAddress = address.formattedAddress();
		assert.equal(address.formattedAddressCache, formattedAddress);
	});

	describe("Rule 1", function () {
		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "APPLEFORD",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "LEDA ENGINEERING LTD",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Leda Engineering Ltd",
				line_2: "Appleford",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: ""
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "APPLEFORD",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "LEDA ENGINEERING LTD",
				department_name: "Engineering Department",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Leda Engineering Ltd",
				line_2: "Engineering Department",
				line_3: "Appleford",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: ""
			}

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 2", function () {
		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "ACACIA AVENUE",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "1 Acacia Avenue",
				line_2: "",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "LOCALITY NAME",
				double_dependant_locality: "",
				thoroughfare: "",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "1 Locality Name",
				line_2: "",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "LOCALITY NAME",
				double_dependant_locality: "DEP LOCALITY NAME",
				thoroughfare: "",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "1 Dep Locality Name",
				line_2: "Locality Name",
				line_3: "",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "OX14 4PG",
				post_town: "ABINGDON",
				dependant_locality: "LOCALITY NAME",
				double_dependant_locality: "DEP LOCALITY NAME",
				thoroughfare: "ACACIA AVENUE",
				building_number: "1",
				building_name: "",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "1 Acacia Avenue",
				line_2: "Dep Locality Name",
				line_3: "Locality Name",
				post_town: "ABINGDON",
				postcode: "OX14 4PG",
				premise: "1"
			}

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 3", function () {
		it ("should return the correct address format", function () {
			sample = {
				postcode: "NR25 7HG",
				post_town: "HOLT",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "STATION ROAD",
				building_number: "",
				building_name: "1A",
				sub_building_name: "",
				dependant_thoroughfare: "SEASTONE COURT",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "1a Seastone Court",
				line_2: "Station Road",
				line_3: "",
				post_town: "HOLT",
				postcode: "NR25 7HG",
				premise: "1a"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "RH6 0HP",
				post_town: "HORLEY",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "UPPER HILL",
				building_number: "",
				building_name: "THE MANOR",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "The Manor",
				line_2: "Upper Hill",
				line_3: "",
				post_town: "HORLEY",
				postcode: "RH6 0HP",
				premise: "The Manor"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
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
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "S D Alcott Florists",
				line_2: "Flower House",
				line_3: "189a Pye Green Road",
				post_town: "CANNOCK",
				postcode: "WS11 5SB",
				premise: "Flower House, 189a"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "ME16 0LP",
				post_town: "GRAFTON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "ST. LAURENCE AVENUE",
				building_number: "",
				building_name: "CENTRE 30",
				sub_building_name: "",
				dependant_thoroughfare: "",
				organisation_name: "JAMES VILLA HOLIDAYS",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "James Villa Holidays",
				line_2: "Centre 30",
				line_3: "St. Laurence Avenue",
				post_town: "GRAFTON",
				postcode: "ME16 0LP",
				premise: "Centre 30"
			}

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 4", function () {
		it ("RULE 4: should return the correct address format", function () {
			sample = {
				postcode: "BH23 6AA",
				post_town: "CHRISTCHURCH",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "THE STREET",
				building_number: "15",
				building_name: "VICTORIA HOUSE",
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

	describe("Rule 5", function () {
		it ("RULE 5: should return the correct address format", function () {
			sample = {
				postcode: "BS8 4AB",
				post_town: "BRISTOL",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "LIME TREE AVENUE",
				building_number: "12",
				building_name: "",
				sub_building_name: "FLAT 1",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Flat 1",
				line_2: "12 Lime Tree Avenue",
				line_3: "",
				post_town: "BRISTOL",
				postcode: "BS8 4AB",
				premise: "Flat 1, 12"
			}

			address_test_battery(sample, expected);
		});

		it ("RULE 5: should return the correct address format", function () {
			sample = {
				postcode: "SP5 4NA",
				post_town: "SALISBURY",
				dependant_locality: "COOMBE BISSETT",
				double_dependant_locality: "",
				thoroughfare: "HIGH STREET NORTH",
				building_number: "12",
				building_name: "",
				sub_building_name: "A",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "12A High Street North",
				line_2: "Coombe Bissett",
				line_3: "",
				post_town: "SALISBURY",
				postcode: "SP5 4NA",
				premise: "12A"
			}

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 6", function () {
		it ("should return the correct address format", function () {
			sample = {
				postcode: "B6 5BA",
				post_town: "BIRMINGHAM",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "ESTONE WALK",
				building_number: "",
				building_name: "Barry Jackson Tower",
				sub_building_name: "10B",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "10B Barry Jackson Tower",
				line_2: "Estone Walk",
				line_3: "",
				post_town: "BIRMINGHAM",
				postcode: "B6 5BA",
				premise: "10B Barry Jackson Tower"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "BS1 2AW",
				post_town: "BRISTOL",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "HIGH STREET WEST",
				building_number: "",
				building_name: "110-114",
				sub_building_name: "CARETAKERS FLAT",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Caretakers Flat",
				line_2: "110-114 High Street West",
				line_3: "",
				post_town: "BRISTOL",
				postcode: "BS1 2AW",
				premise: "Caretakers Flat, 110-114"
			}

			address_test_battery(sample, expected);
		});

		it ("should return the correct address format", function () {
			sample = {
				postcode: "RH6 0HP",
				post_town: "HORLEY",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "UPPER HILL",
				building_number: "",
				building_name: "THE MANOR",
				sub_building_name: "STABLES FLAT",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Stables Flat",
				line_2: "The Manor",
				line_3: "Upper Hill",
				post_town: "HORLEY",
				postcode: "RH6 0HP",
				premise: "Stables Flat, The Manor"
			}

			address_test_battery(sample, expected);
		});
	});

	describe("Rule 7", function () {
		it ("RULE 7: should return the correct address format", function () {
			sample = {
				postcode: "SO23 9AP",
				post_town: "WINCHESTER",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "JOHN STREET",
				building_number: "27",
				building_name: "THE TOWER",
				sub_building_name: "2B",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "2B The Tower",
				line_2: "27 John Street",
				line_3: "",
				post_town: "WINCHESTER",
				postcode: "SO23 9AP",
				premise: "2B The Tower, 27"
			}

			address_test_battery(sample, expected);
		});

		it ("RULE 7: should return the correct address format", function () {
			sample = {
				postcode: "BP23 6AA",
				post_town: "CORYTON",
				dependant_locality: "",
				double_dependant_locality: "",
				thoroughfare: "THE STREET",
				building_number: "15",
				building_name: "VICTORIA HOUSE",
				sub_building_name: "BASEMENT FLAT",
				dependant_thoroughfare: "",
				organisation_name: "",
				department_name: "",
				UDPRN: ""
			}
			
			expected = {
				line_1: "Basement Flat",
				line_2: "Victoria House",
				line_3: "15 The Street",
				post_town: "CORYTON",
				postcode: "BP23 6AA",
				premise: "Basement Flat, Victoria House, 15"
			}

			address_test_battery(sample, expected);
		});
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "B39 0DH",
			post_town: "BIRMINGHAM",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "PACKHOUSE LANE",
			building_number: "",
			building_name: "ROSE COTTAGE",
			sub_building_name: "(SMITH)",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "(Smith)",
			line_2: "Rose Cottage",
			line_3: "Packhouse Lane",
			post_town: "BIRMINGHAM",
			postcode: "B39 0DH",
			premise: "(Smith), Rose Cottage"
		}

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "S64 5BB",
			post_town: "BRADLEY HEATH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "CROMPTON ROAD",
			building_number: "",
			building_name: "(HYNES)",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "(Hynes)",
			line_2: "Crompton Road",
			line_3: "",
			post_town: "BRADLEY HEATH",
			postcode: "S64 5BB",
			premise: "(Hynes)"
		}

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "KT6 5BT",
			post_town: "BRADOCK",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "VIXEN ROAD",
			building_number: "16",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "16 Vixen Road",
			line_2: "",
			line_3: "",
			post_town: "BRADOCK",
			postcode: "KT6 5BT",
			premise: "16"
		}

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "P01 1AF",
			post_town: "PORTSMOUTH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "HIGH STREET",
			building_number: "",
			building_name: "VICTORIA HOUSE",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "CATH'S CAKES",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "Cath's Cakes",
			line_2: "Victoria House",
			line_3: "High Street",
			post_town: "PORTSMOUTH",
			postcode: "P01 1AF",
			premise: "Victoria House"
		}

		address_test_battery(sample, expected);	
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "TN27 8BT",
			post_town: "ASHFORD",
			dependant_locality: "BIDDENDEN",
			double_dependant_locality: "",
			thoroughfare: "OAK AVENUE",
			building_number: "0",
			building_name: "HOLLY HOUSE",
			sub_building_name: "FLAT 1",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "Flat 1, Holly House",
			line_2: "Oak Avenue",
			line_3: "Biddenden",
			post_town: "ASHFORD",
			postcode: "TN27 8BT",
			premise: "Flat 1, Holly House"
		}
			address_test_battery(sample, expected);
		});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "BH23 6AA",
			post_town: "CHRISTCHURCH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "THE STREET",
			building_number: "15",
			building_name: "VICTORIA HOUSE",
			sub_building_name: "FLAT 20",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "Flat 20",
			line_2: "Victoria House",
			line_3: "15 The Street",
			post_town: "CHRISTCHURCH",
			postcode: "BH23 6AA",
			premise: "Flat 20, Victoria House, 15"
		}
			address_test_battery(sample, expected);
		});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "BS1 2AW",
			post_town: "BRISTOL",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "HIGH STREET WEST",
			building_number: "",
			building_name: "110-114",
			sub_building_name: "CARETAKERS FLAT",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "Caretakers Flat",
			line_2: "110-114 High Street West",
			line_3: "",
			post_town: "BRISTOL",
			postcode: "BS1 2AW",
			premise: "Caretakers Flat, 110-114"
		}

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "NR25 7HG",
			post_town: "EMSWORTH",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "ANGELICA WAY",
			thoroughfare_descriptor: "WAY",
			building_number: "16",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "16 Angelica Way",
			line_2: "",
			line_3: "",
			post_town: "EMSWORTH",
			postcode: "NR25 7HG",
			premise: "16"
		}

		address_test_battery(sample, expected);
	});

	it ("should return the correct address format", function () {
		sample = {
			postcode: "OX1 2AY",
			post_town: "OXFORD",
			dependant_locality: "",
			double_dependant_locality: "",
			thoroughfare: "GEORGE STREET",
			building_number: "37",
			building_name: "",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "O'NEILLS",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "O'Neills",
			line_2: "37 George Street",
			line_3: "",
			post_town: "OXFORD",
			postcode: "OX1 2AY",
			premise: "37"
		}

		address_test_battery(sample, expected);
	});


	it ("should return the correct address format", function () {
		sample = {
			postcode: "RH6 0HP",
			post_town: "HORLEY",
			dependant_locality: "NORWOOD",
			double_dependant_locality: "",
			thoroughfare: "",
			building_number: "",
			building_name: "THE MANOR",
			sub_building_name: "",
			dependant_thoroughfare: "",
			organisation_name: "",
			department_name: "",
			UDPRN: ""
		}
		
		expected = {
			line_1: "The Manor",
			line_2: "Norwood",
			line_3: "",
			post_town: "HORLEY",
			postcode: "RH6 0HP",
			premise: "The Manor"
		}

		address_test_battery(sample, expected);
	});

	it ("should return the correct address format", function () {
		sample = {
			postcode: "PO14 1UX",
			post_town: "FAREHAM",
			po_box: "61"
		}
		
		expected = {
			line_1: "PO Box 61",
			line_2: "",
			line_3: "",
			post_town: "FAREHAM",
			postcode: "PO14 1UX",
			premise: "PO Box 61"
		}

		address_test_battery(sample, expected);
	});

	it ("should format addresses with more than 3 lines as a comma separated line 3", function () {
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
		}
		
		expected = {
			line_1: "Britannia Park Veterinary Centre",
			line_2: "Unit 60",
			line_3: "Britannia Way, Britannia Enterprise Park",
			post_town: "LICHFIELD",
			postcode: "WS14 9UY",
			premise: "Unit 60"
		}

		address_test_battery(sample, expected);
	});

	describe("Weird rule", function () {
		it ("Weird Rule: should return the correct address format", function () {
			sample = { postcode: 'EH4 3AJ',
			  post_town: 'EDINBURGH',
			  dependant_locality: '',
			  double_dependant_locality: '',
			  thoroughfare: 'Belgrave Crescent',
			  dependant_thoroughfare: '',
			  building_number: ' ',
			  building_name: '',
			  sub_building_name: '20gf',
			  po_box: '',
			  department_name: '',
			  organisation_name: '',
			  udprn: 8224574,
			  postcode_type: 'S',
			  su_organisation_indicator: ' ',
			  delivery_point_suffix: '1F',
			  postcode_inward: '3AJ',
			  postcode_outward: 'EH4',
			  county: null,
			  country: 'Scotland',
			  district: 'City of Edinburgh',
			  ward: 'Inverleith',
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
			}

			address_test_battery(sample, expected);
		});
	});

});