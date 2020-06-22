mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJjaWluY3lweWUwMWU5dHBrcHlsYnpscjF5In0.siT3_mzRABrCBeG4iGCEYQ";

var bounds = [
	[-88.045342, 41.612104], // Southwest coordinates
	[-87.326560, 42.181465] // Northeast coordinates
];

var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10",
	center: [-87.695787, 41.881302], // Fred Hampton mural
	zoom: 11,
	maxBounds: bounds
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
		searchResultsContainer.style.display = "block";
		searchResultsCounter.innerHTML = "<h4>No search results</h4>";
		searchResultsList.innerHTML = "<p style='margin: 0'>Sorry, we couldn't find that address. Try something like <b>634 E 50th Pl</b>.</p>";
	};

	if (searchInput.value == "") {
		// Input is empty
		clearSearchResults();
	};
};

function createListItem(feature) {
	var item = document.createElement("div");
	var address = feature.properties["Property Address"];
	var owner = feature.properties["Owner Name"];
	var owned = feature.properties["Properties Held by Owner"];

	item.className = "search-result";
	item.innerHTML = "<h3>"+address+"</h3><p>Owned by: "+owner+"</br>Total properties owned: "+owned+"</p><button type='button'>Download their data</button>";
	searchResultsList.appendChild(item);
};

function clearSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        };
    };
    return false;
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

			// Add listener
			searchInput.addEventListener("keyup", matchAddresses);
		};
	};
	request.send();
});

function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();
	console.log("key up ["+value+"]");
	
	// Create list of search results
	var results = buildings.filter(function(feature) {
		var address = feature.properties["Property Address"].trim().toLowerCase();
		// Return feature when trimmed input is found in buildings array
		return address.indexOf(value) > -1;
	});
	console.log("search results populated");

	buildings.forEach(function(e) {	
		var layerID = e.properties["Property Address"];

		// If building is within search results, show it 
		if (containsObject(e, results)) {
			map.setLayoutProperty(
				layerID,
				"visibility",
				"visible"
			);
		} else {
			// Hide it otherwise
			map.setLayoutProperty(
				layerID,
				"visibility",
				"none"
			);
		};	
	});
	// Call function once map is rendered
	map.on("render", afterChangeComplete);

	function afterChangeComplete () {
		// Map isn't loaded, bail out
		if (!map.loaded()) { 
			return; 
		};

		// Map is loaded, render list
		renderResults(results);

		// Remove handler once completed
		map.off("render", afterChangeComplete);
	};
};
