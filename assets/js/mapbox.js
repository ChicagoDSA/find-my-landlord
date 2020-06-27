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
	12, ["case",
		["boolean", ["feature-state", "hover"], false],
		12,
		3
	],
	22, ["case",
		["boolean", ["feature-state", "hover"], false],
		360,
		180
	],
];
var yellow = "#ffff00";
var red = "#ff4d4d";
var pink = "#ff00ff";
var blue = "#3366ff";
var defaultColors = [
	"case",
	["<", ["get", "Properties Held by Owner"], 5],
	blue,
	["<", ["get", "Properties Held by Owner"], 50],
	pink,
	["<", ["get", "Properties Held by Owner"], 200],
	red,
	yellow
];
var defaultOpacity = .5;
var highlightZoom = 12;

// Data
var url = "assets/data/features.geojson";
var json = [];
var buildingAtPoint = null;
var buildingID = null;

// Page elements
var markerContainer = null;
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

	setHoverState("propertyData", "buildings");
});

map.on("click", function(e) {
   	if (buildingAtPoint) {
   		selectPoint(buildingAtPoint);
   	};
});

function setHoverState (source, layer) {
	map.on("mousemove", layer, function(e) {
	    var featuresAtPoint = map.queryRenderedFeatures(e.point);
		buildingAtPoint = getBuildingAtPoint(featuresAtPoint, source);

		if (buildingAtPoint) {
			map.getCanvas().style.cursor = "pointer";
			// Remove existing state
			if (buildingID) {
				map.removeFeatureState({
					source: source,
					id: buildingID
				});
			};
			
			// Set new ID
		    buildingID = buildingAtPoint.id;
		    
		    // Hover to true
		    map.setFeatureState({
		      source: source,
		      id: buildingID,
		    }, {
		    	hover: true
		    });
	    } else {
	    	// Clear var
			buildingAtPoint = null;
		};
	});

	map.on("mouseleave", layer, function() {
		// Hover to false
		if (buildingID) {
			map.setFeatureState({
				source: source,
				id: buildingID
			}, {
				hover: false
			});
		}
		
		// Clear var
		buildingID = null;
		
		// Restore cursor
		map.getCanvas().style.cursor = "";
	});
};

function getBuildingAtPoint (features, source) {
	var filtered = features.filter(function(feature) {
		var pointSource = feature.layer.source;
		// Return feature when trimmed input is found in buildings array
		return pointSource.indexOf(source) > -1;
	});
	return filtered[0];
};
