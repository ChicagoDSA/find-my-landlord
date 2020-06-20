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
var layerIDs = [];
var searchInput = document.getElementById("search-input");

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
	// Load GeoJSON
	var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            var json = JSON.parse(this.response);
            console.log(json);

            map.addSource("buildings", {
				type: "geojson",
				data: json
			});

            json.features.forEach(function(feature) {	
				var address = feature.properties['Address'];
				var layerID = address.trim().toLowerCase();

				if (!map.getLayer(layerID)) {
					map.addLayer({
						"id": layerID,
						"type": "circle",
						"source": "buildings",
						"paint": {
							"circle-radius": 4,
							"circle-color": [
								"step",
								["get", "Owned"],
								"#000",
								0, "#ff9900",
								5, "#990000",
								50, "#ff6666",
								200, "#ff9999"
							],
							"circle-stroke-color": "#660000",
							"circle-stroke-width": 1,
						},
						"filter": ["==", "Address", address]
					});
					layerIDs.push(layerID);
					console.log(layerID);
				}
			});
        }
    };
    request.send();

	searchInput.addEventListener("keyup", function(e) {
		var value = e.target.value.trim().toLowerCase();
		console.log(value);
		layerIDs.forEach(function(layerID) {
			map.setLayoutProperty(
				layerID,
				"visibility",
				layerID.indexOf(value) > -1 ? "visible" : "none"
			);
		});
	});		
});
