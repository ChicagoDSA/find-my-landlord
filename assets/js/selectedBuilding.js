function highlightPoint(feature) {
	const address = feature.properties["Property Address"];
	const owner = feature.properties["Owner Name"];

	// Set search input content
	searchInput.value = address;

	// Center map on address
	map.flyTo({
		center: feature.geometry.coordinates,
		zoom: 12,
		essential: true
	});

	// Build list of buildings with the same owner
	const otherProperties = buildings.filter(function(feature) {
		const otherPropertiesOwner = owner;
		// Return feature when trimmed input is found in buildings array
		return otherPropertiesOwner.indexOf(owner) > -1;
	});

	renderFilteredPoints(feature, otherProperties);
	renderFilteredDescription(feature, otherProperties);
};

function renderFilteredPoints(feature, otherProperties) {
	const address = feature.properties["Property Address"];
	const owner = feature.properties["Owner Name"];

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"]; 
		if (address === objAtIndex) {
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
}

function renderFilteredDescription(feature, otherProperties) {
	const address = feature.properties["Property Address"];
	var owner = feature.properties["Owner Name"];
	const owned = feature.properties["Properties Held by Owner"];

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
		downloadButton.style.cursor = "default";
		
	} else {
		// Set button text and style
		downloadButton.innerHTML = "Download all "+owner+" data";
		downloadButton.style.color = setSecondaryColors(feature);
		downloadButton.style.backgroundColor = setColors(feature);
		downloadButton.style.borderColor = setSecondaryColors(feature);
		
		// Add button listener
		downloadButton.onclick = function(){
			//createPDF(owner, otherProperties);
		};
	}	
}
