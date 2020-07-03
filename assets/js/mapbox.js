// Map setup
mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJja2M2YTN3dG8wYmZlMnp0ZXBzZzJuM3JsIn0.n6bA8boNS3LQW1izwa6MKg";

var control = new mapboxgl.AttributionControl({
	customAttribution: "<a href='https://github.com/ChicagoDSA/rental-property-owners'>View this project on GitHub</a>"
});

var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/dark-v10?optimize=true",
		center: [-87.695787, 41.881302], // Fred Hampton mural
		zoom: 10,
		attributionControl: false
	})
	.addControl(control);

var marker;

// Vars
var defaultRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	8, ["case",
		["boolean", ["feature-state", "hover"], false],
		10,
		2
	],
	12, ["case",
		["boolean", ["feature-state", "hover"], false],
		12,
		4
	],
	22, ["case",
		["boolean", ["feature-state", "hover"], false],
		360,
		180
	]
];
var yellow = "#ffff00";
var red = "#ff4d4d";
var pink = "#ff00ff";
var blue = "#3366ff";
var gray = "#808080";
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

// Page elements
var markerContainer = null;
var searchInputContainer = document.getElementById("search-input-container");
var searchInput = document.getElementById("search-input");
var clearButton = document.getElementById("clear");
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

			addFilteredLayer("propertyData", json, defaultColors, defaultOpacity);
			
			// Show input once loaded
			searchInputContainer.style.display = "block";

			// Add listeners
			searchInput.addEventListener("keyup", matchAddresses);
			// Fix for IE clear button
			searchInput.addEventListener("input", matchAddresses);
		};
	};
	request.send();

	// Remove persisted value
	searchInput.value = "";
});

function addFilteredLayer (name, data, color, opacity) {
	// Set source data
	map.addSource(name, {
		type: "geojson",
		data: data,
		promoteId: "Property Index Number"
	});

	// Add to map
	map.addLayer({
		"id": name,
		"type": "circle",
		"source": name,
		"paint": {
			"circle-radius": defaultRadius,
			"circle-color": color,
			"circle-opacity": opacity
		},
	});

	// Hover unselected layers
	if (name != "selectedPoint") {
		setHoverState(name);
	}
};

function setHoverState (layer) {
	// Declared here to fix duplicates
	var buildingID = null;

	map.on("mousemove", layer, function(e) {
	    var featuresAtPoint = map.queryRenderedFeatures(e.point);
		buildingAtPoint = getBuildingAtPoint(featuresAtPoint, layer);

		if (buildingAtPoint) {
			map.getCanvas().style.cursor = "pointer";
			// Remove existing state
			if (buildingID) {
				map.removeFeatureState({
					source: layer,
					id: buildingID
				});
			};
			
			// Set new ID
		    buildingID = buildingAtPoint.id;
		    
		    // Hover to true
		    map.setFeatureState({
		      source: layer,
		      id: buildingID
		    }, {
		    	hover: true
		    });
	    } else {
	    	// Clear var
			buildingAtPoint = null;
		};
	});

	map.on("click", layer, function(e) {
   		if (buildingAtPoint) {
   			selectPoint(buildingAtPoint);
   		};
	});

	map.on("mouseleave", layer, function() {
		// Hover to false
		if (buildingID) {
			map.setFeatureState({
				source: layer,
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
