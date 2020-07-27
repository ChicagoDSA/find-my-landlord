// Column headers
var propertyAddressColumn = "Property Address";
var communityAreaColumn = "Community Area";
var propertyIndexColumn = "Property Index Number";
var taxpayerColumn = "Taxpayer";
var taxpayerMatchCodeColumn = "Taxpayer Match Code";
var affiliatedWithColumn = "Affiliated With";
var additionalDetailsColumn = "Additional Details";
var ownedColumn = "Properties Held by Taxpayer Match Code";
var unitColumn = "Unit Count from Department of Buildings";
var relativeSizeColumn = "Relative Size";

// Database reference
var databaseCollectionName = "features";
// JSON search
var url = "assets/data/search-index.json";

// Mapbox key
mapboxgl.accessToken = "pk.eyJ1IjoibHVjaWVubGl6bGVwaW9yeiIsImEiOiJja2M2YTN3dG8wYmZlMnp0ZXBzZzJuM3JsIn0.n6bA8boNS3LQW1izwa6MKg";

// Colors
var yellow = "#ffff00";
var red = "#ff4d4d";
var pink = "#ff00ff";
var blue = "#3399ff";
var gray = "#808080";
var black = "#000";
var white = "#fff";

// Map defaults
var defaultOpacity = .5;
var highlightZoom = 12;

// Change colors based on landlord size
var defaultColors = [
	"case",
	["<", ["get", ownedColumn], 5],
	blue,
	["<", ["get", ownedColumn], 50],
	pink,
	["<", ["get", ownedColumn], 200],
	red,
	yellow
];

// Scale radius based on zoom, relative unit size, hover
var defaultRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	8, 
	["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 10, 1000, 20],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 2, 1000, 4]
	],
	16, 
	["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 12, 1000, 24],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 4, 1000, 8]
	],
	22, ["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 360, 1000, 720],
		["interpolate", ["exponential", 1.75], ["get", relativeSizeColumn], 0, 180, 1000, 360]
	]
];

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
