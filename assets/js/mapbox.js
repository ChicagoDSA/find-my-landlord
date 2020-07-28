// Set map defaults
var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/dark-v10?optimize=true",
		center: [-87.695787, 41.881302], // Fred Hampton mural
		zoom: 10,
		maxZoom: 17,
		attributionControl: false
	});

// Create legend
var legendContainer = document.createElement("div");
var legendTitle = document.createElement("h4");
var legend200plus = document.createElement("div");
var legend50plus = document.createElement("div");
var legend5plus = document.createElement("div");
var legendLess5 = document.createElement("div");

// Set content
legendContainer.id = "legend";
legendTitle.innerHTML = "Owned by a landlord with...";
legend200plus.innerHTML = "<span style='background-color: "+yellow+"'></span>200+ properties";
legend50plus.innerHTML = "<span style='background-color: "+red+"'></span>50+ properties";
legend5plus.innerHTML = "<span style='background-color: "+pink+"'></span>5+ properties";
legendLess5.innerHTML = "<span style='background-color: "+blue+"'></span>Less than 5 properties";

// Add attribution control
var attributionControl = new mapboxgl.AttributionControl({
	customAttribution: "<a href='https://github.com/ChicagoDSA/find-my-landlord'>View this project on GitHub</a>"
});
map.addControl(attributionControl);

// Get map control
var bottomRightClass = document.getElementsByClassName("mapboxgl-ctrl-bottom-right");
var bottomRightControl = bottomRightClass[0];

// Add legend inside control
bottomRightControl.insertBefore(legendContainer, bottomRightControl.firstChild);
legendContainer.appendChild(legendTitle);
legendContainer.appendChild(legend200plus);
legendContainer.appendChild(legend50plus);
legendContainer.appendChild(legend5plus);
legendContainer.appendChild(legendLess5);

// Add navigation
var navigationControl = new mapboxgl.NavigationControl();
map.addControl(navigationControl, "top-right");

map.on("load", function() {
	// Load search keys
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			json = JSON.parse(this.response);

			// Set source data
			map.addSource("propertyData", {
				type: "vector",
				tiles: [location.origin+location.pathname+"assets/data/features/{z}/{x}/{y}.pbf"],
				promoteId: propertyIndexColumn
			});
			
			map.addLayer({
				"id": "allProperties",
				"type": "circle",
				"source": "propertyData",
				"source-layer": "features",
				"paint": {
					"circle-radius": defaultRadius,
					"circle-color": defaultColors,
					"circle-opacity": defaultOpacity
				}
			});

			map.addLayer({
				"id": "otherProperties",
				"type": "circle",
				"source": "propertyData",
				"source-layer": "features",
				"layout": {
					"visibility": "none"
				},
				"paint": {
					"circle-radius": defaultRadius,
					"circle-color": defaultColors,
					"circle-opacity": .15
				}
			});

			map.addLayer({
				"id": "relatedProperties",
				"type": "circle",
				"source": "propertyData",
				"source-layer": "features",
				"layout": {
					"visibility": "none"
				},
				"paint": {
					"circle-radius": defaultRadius,
					"circle-color": defaultColors,
					"circle-opacity": .75
				}
			});

			map.addLayer({
				"id": "selectedProperty",
				"type": "circle",
				"source": "propertyData",
				"source-layer": "features",
				"layout": {
					"visibility": "none"
				},
				"paint": {
					"circle-radius": defaultRadius,
					"circle-color": defaultColors,
					"circle-opacity": 1
				}
			});

			setHoverState("propertyData", "features", "allProperties");
			setHoverState("propertyData", "features", "otherProperties");
			setHoverState("propertyData", "features", "relatedProperties");

			// Disable search if IE
			if (checkIE() == true) {
				// Show unsupported message
				searchInput.value = "Internet Explorer isn't supported. Try Chrome!";
				searchInput.disabled = true;
				searchInputContainer.style.display = "block";
			} else {
				// Remove persisted value
				searchInput.value = "";
				// Show search
				searchInputContainer.style.display = "block";
			};

			// Add listeners
			searchInput.addEventListener("keypress", matchAddresses);
			// Fix for IE clear button
			searchInput.addEventListener("input", matchAddresses);	
		};
	};
	request.send();
});

function addFilteredLayer (name, data, radius, color, opacity) {
	// Set source data
	map.addSource(name, {
		type: "geojson",
		data: data,
		promoteId: propertyIndexColumn
	});

	// Add to map
	map.addLayer({
		"id": name,
		"type": "circle",
		"source": name,
		"paint": {
			"circle-radius": radius,
			"circle-color": color,
			"circle-opacity": opacity
		},
	});

	if (name != "selectedProperty") {
		// Style hover
		setHoverState(name, "geojson", name);
	};
};

function setHoverState (sourceData, sourceLayer, hoverLayer) {
	// Building under cursor
	var buildingAtPoint = null;
	// Declared here to fix duplicates
	var buildingID = null;

	map.on("mousemove", hoverLayer, function(e) {
		var featuresAtPoint = map.queryRenderedFeatures(e.point, { layers: [hoverLayer] });
		buildingAtPoint = getBuildingAtPoint(featuresAtPoint, sourceData);

		if (buildingAtPoint) {
			map.getCanvas().style.cursor = "pointer";
			// Remove existing state
			if (buildingID) {
				map.removeFeatureState({
					source: sourceData,
					sourceLayer: sourceLayer
				});
			};
			
			// Set new ID
			buildingID = featuresAtPoint[0].properties[propertyIndexColumn];

			// Hover to true
			map.setFeatureState({
				source: sourceData,
				sourceLayer: sourceLayer,
				id: buildingID
			}, {
				hover: true
			});
		} else {
			// Clear var
			buildingAtPoint = null;
		};
	});

	map.on("click", hoverLayer, function(e) {
		// Hover to false
		if (buildingID) {
			map.setFeatureState({
				source: sourceData,
				sourceLayer: sourceLayer,
				id: buildingID
			}, {
				hover: false
			});
		};

		// Select property
		if (buildingAtPoint) {
			loadProperty(buildingAtPoint);
		};
	});

	map.on("mouseleave", hoverLayer, function() {
		// Hover to false
		if (buildingID) {
			map.setFeatureState({
				source: sourceData,
				sourceLayer: sourceLayer,
				id: buildingID
			}, {
				hover: false
			});
		};
		
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
