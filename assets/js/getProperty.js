function searchProperty(id) {
	var feature;

	return new Promise(function(resolve, reject) {
		// Look up ID in database
		var query = featuresRef
			.where("properties."+propertyIndexColumn, "==", String(id))
			.get()
			.then(function(querySnapshot) {				
				if (querySnapshot.docs.length == 0) {
					console.log("No property found");
					reject();
				} else {
					querySnapshot.forEach(function(doc) {
						// Return feature
						feature = doc.data();
						resolve(feature);
					});
				};
			})
			.catch(function(error) {
				console.log("Error getting property details: ", error);
				reject();
			});
	});
};

function searchRelatedProperties(taxpayerMatchCode) {
	// Empty array
	var allPropertiesOwned = {
		"type": "FeatureCollection",
		"features": []
	};

	return new Promise(function(resolve, reject) {
		if (sessionStorage.getItem(taxpayerMatchCode)) {
			// Get array from sessionStorage
			allPropertiesOwned = JSON.parse(sessionStorage.getItem(taxpayerMatchCode));
			// Return array
			resolve(allPropertiesOwned);
		} else {
			// Get array from database
			// Get properties with same match code
			var query = featuresRef
				.where("properties."+taxpayerMatchCodeColumn, "==", taxpayerMatchCode)
				.get()
				.then(function(querySnapshot) {
					if (querySnapshot.docs.length == 0) {
						console.log("No related properties found");
						reject();
					} else {
						querySnapshot.forEach(function(doc) {
							// Add all matches to the set
							allPropertiesOwned.features.push(doc.data());
						});
					};
				})
				.then(function() {
					// Save to sessionStorage
					sessionStorage.setItem(taxpayerMatchCode, JSON.stringify(allPropertiesOwned));
					// Return array
					resolve(allPropertiesOwned);
				})
				.catch(function(error) {
					console.log("Error getting related properties: ", error);
					reject();
				});
		};
	});
};

function renderSelectedUI(feature) {
	var address = feature.properties[propertyAddressColumn];
	// Update search input
	searchInput.value = address;
	renderClearButton(address);
	// Center map
	centerMap(feature.geometry.coordinates);
	// Render updates
	renderSelectedMap(feature);
	renderSelectedMarker(feature);
	renderSelectedInfo(feature);
};

function renderSelectedMap(feature) {
	var propertyIndex = feature.properties[propertyIndexColumn];
	var taxpayerMatchCode = feature.properties[taxpayerMatchCodeColumn];

	// Show container
	searchResultsContainer.style.display = "block";
	// Hide all properties with same owner
	map.setFilter("allProperties", ["!=", taxpayerMatchCodeColumn, taxpayerMatchCode]);
	map.setPaintProperty("allProperties", "circle-opacity", .15);

	// Query database
	async function load() {
		try {
			var properties = await searchRelatedProperties(taxpayerMatchCode);
			// Show properties on map
			addLayer("relatedProperties", properties, defaultRadius, defaultColors, .75);
			// And hide current property
			map.setFilter("relatedProperties", ["!=", propertyIndexColumn, propertyIndex]);
		} catch (err) {
			console.log("Async function to search related properties failed");
		};	
	};
	load();
};

function renderSelectedMarker(feature) {
	var request = new XMLHttpRequest();
	request.open("GET", "assets/images/marker.svg", true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			var svg = this.response;

			// Create marker
			markerContainer = document.createElement("div");
			markerContainer.id = "marker";

			// Add SVG to marker
			markerContainer.innerHTML = svg;
			markerContainer.children[0].getElementById("outline").setAttribute("stroke", black);
			markerContainer.children[0].getElementById("shape").setAttribute("fill", setColors(feature));
			
			// Add to map
			// Validate coordinates
			if (feature.geometry.coordinates.length == 2) {
				marker = new mapboxgl.Marker(markerContainer)
					.setLngLat(feature.geometry.coordinates)
					.addTo(map);
			};
		};
	};
	request.send();
};

function renderSelectedInfo(feature) {
	var address = feature.properties[propertyAddressColumn];
	var affiliatedWith = feature.properties[affiliatedWithColumn];
	var owned = feature.properties[ownedColumn];
	var taxpayer = feature.properties[taxpayerColumn];
	var taxpayerMatchCode = feature.properties[taxpayerMatchCodeColumn];
	var additionalDetails = feature.properties[additionalDetailsColumn];

	// Handle stray datapoints
	if (owned < 1 || owned == "") {
		owned = 1;
	};

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
	
	// Hide counter
	searchResultsCounter.style.display = "none";
	// Hide list
	searchResultsList.style.display = "none";
	// Show selected container 
	selectedContainer.style.display = "block";

	// Affiliated entity
	var affiliatedWithRow = document.getElementById("affiliated-row");
	// Download button
	var downloadButton = document.getElementById("download-button");
	// Check if data exists
	if (affiliatedWith) {
		// Show row
		affiliatedWithRow.style.display = "block";
		// Set value
		var affiliatedWithValue = document.getElementById("affiliated-value");
		affiliatedWithValue.innerText = affiliatedWith;
	} else {
		// Hide row
		affiliatedWithRow.style.display = "none";
		// Hide button
		downloadButton.style.display = "none";
	};
	
	// Property count
	var ownedRow = document.getElementById("owned-row");
	// Check if data exists
	if (owned) {
		// Show row
		ownedRow.style.display = "block";
		// Set value
		var ownedValue = document.getElementById("owned-value");
		ownedValue.innerText = owned;

		// Also show download button
		downloadButton.style.display = "block";		
		// Set button text and style
		if (affiliatedWith) {
			downloadButton.innerHTML = "Download all "+affiliatedWith+" data";
		} else if (owned > 1) {
			downloadButton.innerHTML = "Download data for "+owned+" taxpayer properties";
		} else if (owned == 1) {
			downloadButton.innerHTML = "Download data for "+owned+" taxpayer property";
		};
		downloadButton.style.backgroundColor = setColors(feature);
		downloadButton.classList.add("button-hover");
		
		// Add button listener
		downloadButton.onclick = function(){
			var pdfTitle;
			// Set PDF title
			if (affiliatedWith) {
				pdfTitle = affiliatedWith;
			} else {
				pdfTitle = taxpayer;
			};
			// Query database
			async function load() {
				try {
					var properties = await searchRelatedProperties(taxpayerMatchCode);
					// Create PDF
					createPDF(pdfTitle, properties);
				} catch (err) {
					console.log("Async function to search related properties failed");
				};	
			};
			load();
		};
	} else {
		// Hide row
		ownedRow.style.display = "none";
	};

	// Taxpayer info
	var taxpayerRow = document.getElementById("taxpayer-row");
	// Check if data exists
	if (taxpayer) {
		// Show row
		taxpayerRow.style.display = "block";
		// Set value
		var taxpayerValue = document.getElementById("taxpayer-value");
		taxpayerValue.innerText = taxpayer;
	} else {
		// Hide row
		ownedRow.style.display = "none";
	};

	// Style row backgronds
	var infoTable = document.getElementById("info-table");
	var rows = infoTable.querySelectorAll("tr[style*='display: block;']");
	for (var r = 0; r < rows.length; r++) {
		if (r % 2 == 0) {
			rows[r].style.backgroundColor = white;
		} else {
			rows[r].style.backgroundColor = setRowColors(feature);
		}
	};

	// Data info
	var dataInfoLink = document.getElementById("data-info-link");
	attachModal(dataInfoLink, "How was this data collected?", dataInfoContent);

	// Additional details
	var additionalDetailsLink = document.getElementById("additional-details-link");
	// Check if data exists
	if (additionalDetails) {
		// Show link
		additionalDetailsLink.style.display = "block";
		// Attach modal
		var additionalDetailsLink = document.getElementById("additional-details-link");
		attachModal(additionalDetailsLink, "Additional property details", additionalDetails);
	} else {
		// Hide link
		additionalDetailsLink.style.display = "none";
	};
};
