function selectPoint(feature) {
	var address = feature.properties["Property Address"];
	var ownerCode = feature.properties["Owner Match Code"];

	// Proceed if selection has an owner
	if (typeof ownerCode !== "undefined") {
		// Build list of buildings with the same owner
		var otherProperties = json.features.filter(function(e) {
			var otherPropertiesOwner = e.properties["Owner Match Code"];

			// Ignore properties with no owners
			if(typeof otherPropertiesOwner !== "undefined") {
				// Return feature when trimmed input is found in buildings array
				return otherPropertiesOwner.indexOf(ownerCode) > -1;
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
	var ownerCode = feature.properties["Owner Match Code"];
	
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
					markerContainer.children[0].getElementById("outline").setAttribute("stroke", setSecondaryColors(selectedBuilding));
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
		} else if (json.features[i].properties["Owner Match Code"] == ownerCode) {
			// Building with the same owner
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
	addFilteredLayer("otherPoints", otherPoints, "#000", defaultOpacity);
	addFilteredLayer("relatedPoints", relatedPoints, defaultColors, defaultOpacity);
	addFilteredLayer("selectedPoint", selectedPoint, defaultColors, 1);
};

function renderFilteredDescription(feature, otherProperties) {
	var address = feature.properties["Property Address"];
	var owner = feature.properties["Owner Name"];
	var owned = feature.properties["Properties Held by Owner"];

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
	
	// Show container
	searchResultsContainer.style.display = "block";
	// Hide scrollbar
	searchResultsList.style.overflowY = "hidden";

	// Create elements
	var headline = document.createElement("h4");
	var container = document.createElement("div");
	var addressText = document.createElement("h3");
	var ownerText = document.createElement("p");
	var ownedText = document.createElement("p");
	var downloadButton = document.createElement("button");

	// Set values
	headline.innerHTML = "Details";
	container.className = "empty-container";
	addressText.innerHTML = address;
	ownerText.innerHTML = "Owner: "+owner;
	ownedText.innerHTML = "Total properties owned: "+owned;

	// Add content to containers
	searchResultsCounter.appendChild(headline);
	searchResultsList.appendChild(container);
	container.appendChild(addressText);
	container.appendChild(ownerText);
	container.appendChild(ownedText);
	container.appendChild(downloadButton);

	if (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0) {
		// Show unsupported message
    	downloadButton.innerHTML = "Internet Explorer doesn't support data downloads, try Chrome!";
		downloadButton.disabled = true;
		downloadButton.style.cursor = "auto";
	} else {
		// Set button text and style
		downloadButton.innerHTML = "Download all "+owner+" data";
		downloadButton.style.color = setSecondaryColors(feature);
		downloadButton.style.backgroundColor = setColors(feature);
		downloadButton.style.borderColor = setSecondaryColors(feature);
		
		// Add button listener
		downloadButton.onclick = function(){
			createPDF(owner, otherProperties);
		};
	};	
};
