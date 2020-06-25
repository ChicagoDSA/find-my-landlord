function selectPoint(feature) {
	var address = feature.properties["Property Address"];
	var owner = feature.properties["Owner Name"];

	// Build list of buildings with the same owner
	var otherProperties = buildings.filter(function(e) {
		var otherPropertiesOwner = e.properties["Owner Name"];
		// Return feature when trimmed input is found in buildings array
		return otherPropertiesOwner.indexOf(owner) > -1;
	});

	// Set UI
	searchInput.value = address;
	centerMap(feature.geometry.coordinates);
	resetPointStyles();
	renderFilteredPoints(feature, otherProperties);
	renderFilteredDescription(feature, otherProperties);
};

function renderFilteredPoints(feature, otherProperties) {
	var address = feature.properties["Property Address"];
	var owner = feature.properties["Owner Name"];

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"]; 
		if (address === objAtIndex) {
			// Building that matches input
			map.setPaintProperty(objAtIndex, "circle-opacity", 1);

			var selectedBuilding = buildings[i];

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
					marker = new mapboxgl.Marker(markerContainer)
						.setLngLat(selectedBuilding.geometry.coordinates)
						.addTo(map);
				};
			};
			request.send();
		} else if (buildings[i].properties["Owner Name"] == owner) {
			// Building with the same owner
			map.setPaintProperty(objAtIndex, "circle-opacity", .5);
		}
		else {
			// All other buildings
			map.setPaintProperty(objAtIndex, "circle-color", "#000");
			map.setPaintProperty(objAtIndex, "circle-opacity", .5);
		};
	};
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
