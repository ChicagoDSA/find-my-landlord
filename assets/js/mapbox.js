mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJjaWluY3lweWUwMWU5dHBrcHlsYnpscjF5In0.siT3_mzRABrCBeG4iGCEYQ";

var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10",
	center: [-87.695787, 41.881302], // Fred Hampton mural
	zoom: 10,
});

var url = "assets/data/features.geojson";
var buildings = [];
var searchInput = document.getElementById("search-input");
var searchResultsContainer = document.getElementById("search-results-container");
var searchResultsCounter = document.getElementById("search-results-counter");
var searchResultsList = document.getElementById("search-results-list");

map.addControl(new mapboxgl.NavigationControl());

function renderResults(features) {
	clearSearchResults();

	if (features.length) {		
		// Results were found
		// Show container
		searchResultsContainer.style.display = "block";
		// Restore scrollbar
		searchResultsList.style.overflowY = "scroll";

		// Change language depending on number of results
		if (features.length == 1) {
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search result";
		} else {
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search results";
		};

		// Add ListItems
		features.forEach(function(feature) {
			createListItem(feature);
		});
	} else if (features.length == 0 && searchInput.value != "") {
		// No results found
		// Show container
		searchResultsContainer.style.display = "block";
		// Hide scrollbar
		searchResultsList.style.overflowY = "hidden";

		// Create elements
		const headline = document.createElement("h4");
		const description = document.createElement("p");

		// Set values
		headline.innerHTML = "No search results";
		description.className = "empty-container";
		description.innerHTML = "Sorry, we couldn't find that address. Try something like <b>634 E 50th Pl</b>.";

		// Add content to containers
		searchResultsCounter.appendChild(headline);
		searchResultsList.appendChild(description);
	};

	if (searchInput.value == "") {
		// Input is empty
		clearSearchResults();
	};
};

function createListItem(feature) {
	const item = document.createElement("div");
	const addressText = document.createElement("p");
	var address = feature.properties["Property Address"];

	item.className = "search-result";
	addressText.innerHTML = address;

	// Highlight part of string that matches input 
	highlightText(searchInput, addressText);

	item.appendChild(addressText);
	searchResultsList.appendChild(item);

	// Add click event
	item.onclick = function(){
		highlightPoint(feature, address);
	};
};

function highlightText(input, destination) {
	var regex = new RegExp(input.value, "gi")
	var response = destination.innerHTML.replace(regex, function(str) {
		return "<b>" + str + "</b>"
	});
	destination.innerHTML = response;
};

function highlightPoint(feature, address) {
	searchInput.value = address;

	// Center map on address
	map.flyTo({
		center: feature.geometry.coordinates,
		zoom: 12,
		essential: true
	});

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"]; 
		if (address === objAtIndex) {
			// Show address at full opacity
			map.setPaintProperty(objAtIndex, "circle-opacity", 1);
		}
		else {
			// Dim other points
			map.setPaintProperty(objAtIndex, "circle-opacity", .2);
		};
	};

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
	var owner = feature.properties["Owner Name"];
	var owned = feature.properties["Properties Held by Owner"];
	headline.innerHTML = "Details";
	container.className = "empty-container";
	addressText.innerHTML = address;
	ownerText.innerHTML = "Owner: "+owner;
	ownedText.innerHTML = "Total properties owned: "+owned;
	downloadButton.innerHTML = "Download all "+owner+" data";

	// Add content to containers
	searchResultsCounter.appendChild(headline);
	searchResultsList.appendChild(container);
	container.appendChild(addressText);
	container.appendChild(ownerText);
	container.appendChild(ownedText);
	container.appendChild(downloadButton);

	// Add button listener
	downloadButton.onclick = function(){
		// Create PDF
		var doc = new jsPDF();
		doc.text(owner, 10, 10);
		// Save with trimmed filename
		doc.save(owner.replace(/\s+/g, "")+".pdf");
	};
};

function clearPointStyles() {
	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"]; 
		map.setPaintProperty(objAtIndex, "circle-opacity", 1);
	};
};

function clearSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
};

map.on("load", function() {
	// Load GeoJSON
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			var json = JSON.parse(this.response);

			map.addSource("buildings", {
				type: "geojson",
				data: json
			});

			json.features.forEach(function(feature) {	
				var address = feature.properties["Property Address"];

				if (!map.getLayer(address)) {
					map.addLayer({
						"id": address,
						"type": "circle",
						"source": "buildings",
						"paint": {
							"circle-radius": {
								"base": 3,
								"stops": [
									[12, 3],
									[22, 180]
								]
							},
							"circle-color": [
								"step",
								["get", "Properties Held by Owner"],
								"#000",
								0, "#ff9900",
								5, "#990000",
								50, "#ff6666",
								200, "#ff9999"
							]
						},
						"filter": ["==", "Property Address", address]
					});
					buildings.push(feature);
				};
			});
			// Show input once loaded
			searchInput.style.display = "block";

			// Add listeners
			searchInput.addEventListener("keyup", matchAddresses);
			// Fix for IE clear button
			searchInput.addEventListener("input", matchAddresses);
		};
	};
	request.send();
});

function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();
	console.log("key up ["+value+"]");

	// Reset highlighted points
	clearPointStyles();

	// Create list of search results
	var results = buildings.filter(function(feature) {
		var address = feature.properties["Property Address"].trim().toLowerCase();
		// Return feature when trimmed input is found in buildings array
		return address.indexOf(value) > -1;
	});

	// Render list
	console.log("search results populated");
	renderResults(results);
};
