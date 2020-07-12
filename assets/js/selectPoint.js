function selectPoint(feature) {
	var address = feature.properties["Property Address"];
	var affiliatedWith = feature.properties["Affiliated With"];

	// Proceed if selection has an affliated with
	if (typeof affiliatedWith !== "undefined") {
		// Build list of buildings with the same affliated with
		var otherProperties = json.features.filter(function(e) {
			var otherPropertiesAffiliatedWith = e.properties["Affiliated With"];

			// Ignore properties with no affliated with
			if(typeof otherPropertiesAffiliatedWith !== "undefined") {
				// Return feature when trimmed input is found in buildings array
				return otherPropertiesAffiliatedWith.indexOf(affiliatedWith) > -1;
			};
		});
	};

	// Set UI
	searchInput.value = address;
	renderClearButton(address);
	centerMap(feature.geometry.coordinates);
	resetPointStyles(feature);
	renderFilteredPoints(feature, otherProperties);
	renderFilteredDescription(feature, otherProperties);
};

function renderFilteredPoints(feature, otherProperties) {
	var propertyIndex = feature.properties["Property Index Number"];
	var affiliatedWith = feature.properties["Affiliated With"];
	
	// Create empty GeoJSON objects
	var otherPoints = {
	  "type": "FeatureCollection",
	  "features": []
	};
	var relatedPoints= {
	  "type": "FeatureCollection",
	  "features": []
	};
	var selectedPoint= {
	  "type": "FeatureCollection",
	  "features": []
	};

	// Hide layer with complete dataset
	map.setLayoutProperty("propertyData", "visibility", "none");

	for (var i = 0; i < json.features.length; i++) {
		var objAtIndex = json.features[i].properties["Property Index Number"]; 
		if (propertyIndex === objAtIndex) {
			// Selected building
			// Add feature to GeoJSON object
			selectedPoint.features.push(json.features[i]);

			var selectedBuilding = json.features[i];

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
					markerContainer.children[0].getElementById("shape").setAttribute("fill", setColors(selectedBuilding));
					
					// Add to map
					// Validate coordinates
					if (selectedBuilding.geometry.coordinates.length == 2) {
						marker = new mapboxgl.Marker(markerContainer)
							.setLngLat(selectedBuilding.geometry.coordinates)
							.addTo(map);
					};
				};
			};
			request.send();
		} else if (json.features[i].properties["Affiliated With"] == affiliatedWith) {
			// Building with the same affliated with
			// Add feature to GeoJSON object
			relatedPoints.features.push(json.features[i]);
		}
		else {
			// All other buildings
			// Add feature to GeoJSON object
			otherPoints.features.push(json.features[i]);
		};
	};

	// Render layers
	addFilteredLayer("otherPoints", otherPoints, black, defaultOpacity);
	addFilteredLayer("relatedPoints", relatedPoints, defaultColors, defaultOpacity);
	addFilteredLayer("selectedPoint", selectedPoint, defaultColors, 1);
};

function renderFilteredDescription(feature, otherProperties) {
	var address = feature.properties["Property Address"];
	var affiliatedWith = feature.properties["Affiliated With"];
	var owned = feature.properties["Properties Held by Affiliated With"];
	var taxpayer = feature.properties["Taxpayer"];

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
	// Hide scrollbar
	searchResultsList.style.overflowY = "hidden";

	// Create elements
	var container = document.createElement("div");
	var infoTable = document.createElement("table");

	// Set values
	container.className = "empty-container";

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
		var downloadButton = document.createElement("button");
		container.appendChild(downloadButton);
	};
	
	// Property count
	var ownedRow = document.createElement("tr");
	var ownedLabel = document.createElement("td");
	var ownedValue = document.createElement("td");

	ownedLabel.innerHTML = "Total properties owned:";
	ownedValue.innerHTML = owned;

	infoTable.appendChild(ownedRow);
	ownedRow.appendChild(ownedLabel);
	ownedRow.appendChild(ownedValue);

	// Taxpayer info
	if (taxpayer) {
		var taxpayerRow = document.createElement("tr");
		var taxpayerLabel = document.createElement("td");
		var taxpayerValue = document.createElement("td");

		taxpayerLabel.innerHTML = "Taxpayer:";
		taxpayerValue.innerHTML = taxpayer;

		// Table row
		infoTable.appendChild(taxpayerRow);
		taxpayerRow.appendChild(taxpayerLabel);
		taxpayerRow.appendChild(taxpayerValue);
	};

	// Add content to containers
	searchResultsList.appendChild(container);
	container.insertBefore(infoTable, container.firstChild);

	// Data info
	var dataInfoLink = document.createElement("p");
	dataInfoLink.id = "data-info-link";
	dataInfoLink.innerText = "How was this data collected?";
	container.appendChild(dataInfoLink);
	attachModal(dataInfoLink);

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
			
			// Add button listener
			downloadButton.onclick = function(){
				createPDF(affiliatedWith, otherProperties);
			};
		};
	};
};
