function highlightPoint(feature) {
	// Set search input content
	searchInput.value = feature.properties["Property Address"];

	// Center map on address
	map.flyTo({
		center: feature.geometry.coordinates,
		zoom: 12,
		essential: true
	});

	// Build list of buildings with the same owner
	const otherProperties = buildings.filter(function(feature) {
		const otherPropertiesOwner = feature.properties["Owner Name"];
		// Return feature when trimmed input is found in buildings array
		return otherPropertiesOwner.indexOf(feature.properties["Owner Name"]) > -1;
	});

	renderFilteredPoints(feature, otherProperties);
	renderFilteredDescription(feature, otherProperties);
};

function renderFilteredPoints(feature, otherProperties) {
	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"]; 
		if (feature.properties["Property Address"] === objAtIndex) {
			// Building that matches input
			map.setPaintProperty(objAtIndex, "circle-opacity", 1);

			var selectedBuilding = buildings[i];

			const request = new XMLHttpRequest();
			request.open("GET", "assets/images/marker.svg", true);
			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var svg = this.response;

					// Create marker
					marker = document.createElement("div");
					marker.id = "marker";
					new mapboxgl.Marker(marker)
						.setLngLat(selectedBuilding.geometry.coordinates)
						.addTo(map);

					// Add SVG to marker
					marker.innerHTML = svg;
					marker.children[0].getElementById("outline").setAttribute("stroke", setSecondaryColors(selectedBuilding));
					marker.children[0].getElementById("shape").setAttribute("fill", setColors(selectedBuilding));
				};
			};
			request.send();
		} else if (buildings[i].properties["Owner Name"] == feature.properties["Owner Name"]) {
			// Building with the same owner
			map.setPaintProperty(objAtIndex, "circle-opacity", .5);
		}
		else {
			// All other buildings
			map.setPaintProperty(objAtIndex, "circle-color", "#000");
			map.setPaintProperty(objAtIndex, "circle-opacity", .5);
		};
	};
}

function renderFilteredDescription(feature, otherProperties) {
	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
	
	// Hide scrollbar
	searchResultsList.style.overflowY = "hidden";

	// Create elements
	const headline = document.createElement("h4");
	const container = document.createElement("div");
	const addressText = document.createElement("h3");
	const ownerText = document.createElement("p");
	const ownedText = document.createElement("p");
	const downloadButton = document.createElement("button");

	// Set values
	headline.innerHTML = "Details";
	container.className = "empty-container";
	addressText.innerHTML = feature.properties["Property Address"];
	ownerText.innerHTML = "Owner: "+feature.properties["Owner Name"];
	ownedText.innerHTML = "Total properties owned: "+feature.properties["Properties Held by Owner"];
	downloadButton.innerHTML = "Download all "+feature.properties["Owner Name"]+" data";
	downloadButton.style.color = setSecondaryColors(feature);
	downloadButton.style.backgroundColor = setColors(feature);
	downloadButton.style.borderColor = setSecondaryColors(feature);

	// Add content to containers
	searchResultsCounter.appendChild(headline);
	searchResultsList.appendChild(container);
	container.appendChild(addressText);
	container.appendChild(ownerText);
	container.appendChild(ownedText);
	container.appendChild(downloadButton);

	// Add button listener
	downloadButton.onclick = function(){
		createPDF(feature.properties["Owner Name"], otherProperties);
	};
}

function clearPointStyles() {
	if (typeof marker !== "undefined") {
		// Remove marker
		marker.remove();
		marker = undefined;
	};

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"];
		
		// Revert to original style 
		map.setPaintProperty(objAtIndex, "circle-color", setColors(buildings[i]));
		map.setPaintProperty(objAtIndex, "circle-opacity", defaultOpacity);
	};
};