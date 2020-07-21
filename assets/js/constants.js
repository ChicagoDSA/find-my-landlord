// Mapbox key
mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJja2M2YTN3dG8wYmZlMnp0ZXBzZzJuM3JsIn0.n6bA8boNS3LQW1izwa6MKg";

// Colors
var yellow = "#ffff00";
var red = "#ff4d4d";
var pink = "#ff00ff";
var green = "#33cc33";
var gray = "#808080";
var black = "#000";

// Map defaults
var defaultOpacity = .5;
var highlightZoom = 12;

// Change colors based on landlord size
var defaultColors = [
	"case",
	["<", ["get", "Properties Held by Affiliated With"], 5],
	green,
	["<", ["get", "Properties Held by Affiliated With"], 50],
	pink,
	["<", ["get", "Properties Held by Affiliated With"], 200],
	red,
	yellow
];

// Scale radius based on zoom, hover
var defaultRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	8, ["case",
		["boolean", ["feature-state", "hover"], false],
		10,
		2
	],
	16, ["case",
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

// Selected and related properties
var selectedRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	8, ["case",
		["boolean", ["feature-state", "hover"], false],
		20,
		4
	],
	16, ["case",
		["boolean", ["feature-state", "hover"], false],
		24,
		8
	],
	22, ["case",
		["boolean", ["feature-state", "hover"], false],
		720,
		360
	]
];

// Data
var url = "assets/data/searchIndex.json";
var json = [];
var buildingAtPoint = null;

// Custom UI
var markerContainer = null;
var marker = null;
var searchInputContainer = document.getElementById("search-input-container");
var searchInput = document.getElementById("search-input");
var clearButton = document.getElementById("clear");
var searchResultsContainer = document.getElementById("search-results-container");
var searchResultsCounter = document.getElementById("search-results-counter");
var searchResultsList = document.getElementById("search-results-list");
var selectedContainer = document.getElementById("selected-container");
