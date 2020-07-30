// Set map defaults
var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/lucienlizlepiorz/ckd61fpi915jk1ioyhcpvd10y",
		center: [-87.695787, 41.881302], // Fred Hampton mural
		zoom: 10,
		attributionControl: false
	});

// Create legend
var legendContainer = document.createElement("div");
var legendTitle = document.createElement("h4");
var legend100plus = document.createElement("div");
var legend10plus = document.createElement("div");
var legend3plus = document.createElement("div");
var legendLess3 = document.createElement("div");
var legendUndetermined = document.createElement("div");

// Set content
legendContainer.id = "legend";
legendTitle.innerHTML = "Owned by a landlord with...";
legend100plus.innerHTML = "<span style='background-color: "+color4+"'></span>100+ properties";
legend10plus.innerHTML = "<span style='background-color: "+color3+"'></span>10+ properties";
legend3plus.innerHTML = "<span style='background-color: "+color2+"'></span>3+ properties";
legendLess3.innerHTML = "<span style='background-color: "+color1+"'></span>1-2 properties";
legendUndetermined.innerHTML = "<span style='background-color: "+black+"'></span>Cannot be determined";

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
legendContainer.appendChild(legend100plus);
legendContainer.appendChild(legend10plus);
legendContainer.appendChild(legend3plus);
legendContainer.appendChild(legendLess3);
legendContainer.appendChild(legendUndetermined);

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
				maxzoom: 14, // Allows overzoom
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

			setHoverState("propertyData", "features", "allProperties");
			//map.setFilter("allProperties", ["!=", taxpayerMatchCodeColumn, "U-00001"]);

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

function addLayer (name, data, radius, color, opacity) {
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

	// Style hover
	setHoverState(data, null, name);
};

function setHoverState (sourceData, sourceLayer, hoverLayer) {
	// Building under cursor
	var buildingAtPoint = null;
	// Declared here to fix duplicates
	var buildingID = null;

	map.on("mousemove", hoverLayer, function(e) {
		var featuresAtPoint = map.queryRenderedFeatures(e.point, { layers: [hoverLayer] });
		if (sourceLayer != null) {
			// Vector source
			buildingAtPoint = getBuildingAtPoint(featuresAtPoint, sourceData);
		} else {
			// GeoJSON source
			buildingAtPoint = getBuildingAtPoint(featuresAtPoint, hoverLayer);
		};

		if (buildingAtPoint) {
			map.getCanvas().style.cursor = "pointer";
			// Remove existing state
			if (buildingID) {
				if (sourceLayer != null) {
					// Vector source
					map.removeFeatureState({
						source: sourceData,
						sourceLayer: sourceLayer
					});
				} else {
					// GeoJSON source
					map.removeFeatureState({
						source: hoverLayer,
						id: buildingID
					});
				};
			};
			
			// Set new ID
			buildingID = featuresAtPoint[0].properties[propertyIndexColumn];

			// Hover to true
			if (sourceLayer != null) {
				// Vector source
				map.setFeatureState({
					source: sourceData,
					sourceLayer: sourceLayer,
					id: buildingID
				}, {
					hover: true
				});
			} else {
				// GeoJSON source
				map.setFeatureState({
					source: hoverLayer,
					id: buildingID
				}, {
					hover: true
				});
			};
		} else {
			// Clear var
			buildingAtPoint = null;
		};
	});

	map.on("click", hoverLayer, function(e) {
		// Hover to false
		if (buildingID) {
			if (sourceLayer != null) {
				// Vector source
				map.setFeatureState({
					source: sourceData,
					sourceLayer: sourceLayer,
					id: buildingID
				}, {
					hover: false
				});
			} else {
				// GeoJSON source
				map.setFeatureState({
					source: hoverLayer,
					id: buildingID
				}, {
					hover: false
				});
			};	
		};

		// Select property
		if (buildingAtPoint) {
			// Reset UI
			resetMap();
			// Update it
			renderSelectedUI(buildingAtPoint);
			// Log event
			firebase.analytics().logEvent("map-point-clicked", { 
				property_address: buildingAtPoint.properties[propertyAddressColumn],
				taxpayer: buildingAtPoint.properties[taxpayerColumn],
				affiliated_with: buildingAtPoint.properties[affiliatedWithColumn],
			});
		};
	});

	map.on("mouseleave", hoverLayer, function() {
		// Hover to false
		if (buildingID) {
			if (sourceLayer != null) {
				// Vector source
				map.setFeatureState({
					source: sourceData,
					sourceLayer: sourceLayer,
					id: buildingID
				}, {
					hover: false
				});
			} else {
				// GeoJSON source
				map.setFeatureState({
					source: hoverLayer,
					id: buildingID
				}, {
					hover: false
				});
			};	
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
