function selectProperty(feature) {
	var address = feature.properties["Property Address"];
	var affiliatedWith = feature.properties["Affiliated With"];
	renderSelectedUI(address, feature.geometry.coordinates, feature);
};

function loadProperty(feature) {
	var address = feature["Property Address"];
	var propertyID = feature["Property Index Number"];

	var query = featuresRef
		.where("properties.Property Index Number", "==", String(propertyID))
		.get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
				var affiliatedWith = doc.data().properties["Affiliated With"];
				renderSelectedUI(address, doc.data().geometry.coordinates, doc.data());
	        });
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    })
};

function renderSelectedUI(address, coordinates, feature) {
	// Update search input
	searchInput.value = address;
	renderClearButton(address);
	// Center map
	centerMap(feature.geometry.coordinates);
	// Reset UI
	resetSelectedInfo();
	resetSelectedMarker();
	// Render updates
	renderFilteredPoints(feature);
};

function renderFilteredPoints(feature) {
	var propertyAddress = feature.properties["Property Address"];
	var affiliatedWith = feature.properties["Affiliated With"];

	var allPropertiesOwned = {
	  "type": "FeatureCollection",
	  "features": []
	};

	var otherPropertiesOwned = {
	  "type": "FeatureCollection",
	  "features": []
	};

	var selectedProperty = {
	  "type": "FeatureCollection",
	  "features": []
	};

	var query = featuresRef
		.where("properties.Affiliated With", "==", affiliatedWith)
		.get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
				// Add all matches to the set
				allPropertiesOwned.features.push(doc.data());

				if (doc.data().properties["Property Address"] == propertyAddress) {
					// Add selected property to one set
					selectedProperty.features.push(doc.data());
				} else {
					// Add other properties to a different set
					otherPropertiesOwned.features.push(doc.data());
				};
	        });
	    })
	    .then(function() {
	    	// Data is loaded
	    	map.setPaintProperty("features", "circle-opacity", .25);
			map.setPaintProperty("features", "circle-color", black);

	    	addFilteredLayer("otherPropertiesOwned", otherPropertiesOwned, defaultColors, 1);
	    	addFilteredLayer("selectedProperty", selectedProperty, defaultColors, 1);

	    	// Show UI
	    	renderSelectedInfo(feature, allPropertiesOwned);
			renderSelectedMarker(feature);
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    })
};

function renderSelectedInfo(feature, allPropertiesOwned) {
	var address = feature.properties["Property Address"];
	var affiliatedWith = feature.properties["Affiliated With"];
	var owned = feature.properties["Properties Held by Affiliated With"];
	var taxpayer = feature.properties["Taxpayer"];
	var additionalDetails = feature.properties["Additional Details"];

	// Handle stray datapoints
	if (owned < 1 || owned == "") {
		owned = 1;
	};

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
	
	// Show container
	searchResultsContainer.style.display = "block";
	// Hide counter
	searchResultsCounter.style.display = "none";
	// Hide list
	searchResultsList.style.display = "none";

	// Create elements
	var container = document.createElement("div");
	var infoTable = document.createElement("table");
	var bottomLinks = document.createElement("div");

	// Set values
	container.id = "selected-container";
	bottomLinks.id = "bottom-links";

	// Affiliated entity
	if (affiliatedWith) {
		var affiliatedWithRow = document.createElement("tr");
		var affiliatedWithLabel = document.createElement("td");
		var affiliatedWithValue = document.createElement("td");

		affiliatedWithLabel.innerHTML = "Affiliated with:";
		affiliatedWithValue.innerHTML = affiliatedWith;

		// Table row
		infoTable.appendChild(affiliatedWithRow);
		affiliatedWithRow.appendChild(affiliatedWithLabel);
		affiliatedWithRow.appendChild(affiliatedWithValue);

		// Download
		var downloadButton;
		var downloadButton = document.createElement("button");
		container.appendChild(downloadButton);
	};
	
	// Property count
	var ownedRow = document.createElement("tr");
	var ownedLabel = document.createElement("td");
	var ownedValue = document.createElement("td");

	ownedLabel.innerHTML = "Properties owned:";
	ownedValue.innerHTML = owned;

	infoTable.appendChild(ownedRow);
	ownedRow.appendChild(ownedLabel);
	ownedRow.appendChild(ownedValue);

	// Taxpayer info
	if (taxpayer) {
		var taxpayerRow = document.createElement("tr");
		var taxpayerLabel = document.createElement("td");
		var taxpayerValue = document.createElement("td");

		taxpayerLabel.innerHTML = "Property taxpayer:";
		taxpayerValue.innerHTML = taxpayer;

		// Table row
		infoTable.appendChild(taxpayerRow);
		taxpayerRow.appendChild(taxpayerLabel);
		taxpayerRow.appendChild(taxpayerValue);
	};

	// Add content to containers
	searchResultsContainer.appendChild(container);
	container.insertBefore(infoTable, container.firstChild);

	// Style row backgronds
	var rows = infoTable.querySelectorAll("tr:nth-child(even)");
	for (var r = 0; r < rows.length; r++) {
    	rows[r].style.backgroundColor = setRowColors(feature);
	};

	// Data info
	var dataInfoLink = document.createElement("p");
	dataInfoLink.id = "data-info-link";
	dataInfoLink.className = "property-details-link";
	dataInfoLink.tabIndex = 0; // Allow text to be focused
	dataInfoLink.innerText = "How was this data collected?";
	bottomLinks.appendChild(dataInfoLink);
	attachModal(dataInfoLink, "How was this data collected?", dataInfoContent);

	// Additional details
	if (additionalDetails) {
		var additionalDetailsLink = document.createElement("p");
		additionalDetailsLink.id = "additional-details-link";
		additionalDetailsLink.className = "property-details-link";
		additionalDetailsLink.tabIndex = 0; // Allow text to be focused
		additionalDetailsLink.innerText = "Additional property details";
		bottomLinks.appendChild(additionalDetailsLink);
		attachModal(additionalDetailsLink, "Additional property details", additionalDetails);
	};

	// Add clear to bottom links container
	var clearFloat = document.createElement("div");
	clearFloat.style.clear = "both";
	bottomLinks.appendChild(clearFloat);

	// Append links
	container.appendChild(bottomLinks);

	if (downloadButton) {
		if (checkIE() == true) {
			// Show unsupported message
	    	downloadButton.innerHTML = "Internet Explorer doesn't support data downloads, try Chrome!";
			downloadButton.disabled = true;
			downloadButton.style.cursor = "auto";
		} else {
			// Set button text and style
			downloadButton.innerHTML = "Download all "+affiliatedWith+" data";
			downloadButton.style.backgroundColor = setColors(feature);
			downloadButton.classList.add("button-hover");

			// Add button listener
			downloadButton.onclick = function(){
				createPDF(affiliatedWith, allPropertiesOwned);
			};
		};
	};
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
