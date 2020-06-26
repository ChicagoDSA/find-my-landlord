// Map setup
mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJjaWluY3lweWUwMWU5dHBrcHlsYnpscjF5In0.siT3_mzRABrCBeG4iGCEYQ";
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10?optimize=true",
	center: [-87.695787, 41.881302], // Fred Hampton mural
	zoom: 10,
});
var marker;

// Vars
var defaultRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	12, 3,
	22, 180,
];
var defaultColors = [
	"case",
	["<", ["get", "Properties Held by Owner"], 5],
	"#3366ff",
	["<", ["get", "Properties Held by Owner"], 50],
	"#ff00ff",
	["<", ["get", "Properties Held by Owner"], 200],
	"#ff4d4d",
	"#ffff00"
];
var defaultOpacity = [
	"case",
	["boolean",
		["feature-state", "clicked"],
		false
	],
	1,
	.5
];
var highlightZoom = 12;

// Data
var url = "assets/data/features.geojson";
var json = [];
var buildingAtPoint;

// Page elements
var markerContainer;
var searchInput = document.getElementById("search-input");
var searchResultsContainer = document.getElementById("search-results-container");
var searchResultsCounter = document.getElementById("search-results-counter");
var searchResultsList = document.getElementById("search-results-list");

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
	// Load GeoJSON
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			json = JSON.parse(this.response);

			map.addSource("propertyData", {
				type: "geojson",
				data: json,
				generateId: true
			});
			
			map.addLayer({
				"id": "buildings",
				"type": "circle",
				"source": "propertyData",
				"paint": {
					"circle-radius": defaultRadius,
					"circle-color": defaultColors,
					"circle-opacity": defaultOpacity
				},
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

	map.on("mousemove", function(e) {
        var featuresAtPoint = map.queryRenderedFeatures(e.point);
		buildingAtPoint = getBuildingAtPoint(featuresAtPoint);

		if (buildingAtPoint) {
			map.getCanvas().style.cursor = "pointer";
        } else {
        	// Restore cursor
			map.getCanvas().style.cursor = "";
			buildingAtPoint = undefined;
		};
    });

    map.on("click", function(e) {
       	if (buildingAtPoint) {
       		selectPoint(buildingAtPoint);
       	};
    });
});

function getBuildingAtPoint (features) {
	var filtered = features.filter(function(feature) {
		var source = feature.layer.source;
		// Return feature when trimmed input is found in buildings array
		return source.indexOf("propertyData") > -1;
	});
	return filtered[0];
};
