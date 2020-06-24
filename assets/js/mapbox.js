// Map setup
mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJjaWluY3lweWUwMWU5dHBrcHlsYnpscjF5In0.siT3_mzRABrCBeG4iGCEYQ";
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10",
	center: [-87.695787, 41.881302], // Fred Hampton mural
	zoom: 10,
});
var marker;
var defaultOpacity = .5;

// Data
var url = "assets/data/features.geojson";
var buildings = [];

// Page elements
var searchInput = document.getElementById("search-input");
var searchResultsContainer = document.getElementById("search-results-container");
var searchResultsCounter = document.getElementById("search-results-counter");
var searchResultsList = document.getElementById("search-results-list");

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
	// Load GeoJSON
	const request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			var json = JSON.parse(this.response);

			map.addSource("buildings", {
				type: "geojson",
				data: json
			});

			json.features.forEach(function(feature) {	
				const address = feature.properties["Property Address"];

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
							"circle-color": setColors(feature),
							"circle-opacity": defaultOpacity
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
