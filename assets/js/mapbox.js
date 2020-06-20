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

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
	map.addSource("points", {
		type: "geojson",
		data: "assets/data/features.geojson"
	});			
	map.addLayer({
		"id": "points",
		"type": "circle",
		"source": "points",
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
		}
	});		
});
