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
var color4 = "#ff6150";
var color3 = "#ffcb00";
var color2 = "#54d2d2";
var color1 = "#05172e";
var gray = "#808080";
var black = "#000";
var white = "#fff";

// Map defaults
var defaultOpacity = .5;
var highlightZoom = 12;

// Change colors based on landlord size
var defaultColors = [
	"case",
	[">=", ["get", ownedColumn], 100],
	color4,
	[">=", ["get", ownedColumn], 10],
	color3,
	[">=", ["get", ownedColumn], 3],
	color2,
	[">", ["get", ownedColumn], 0],
	color1,
	white
];

// Scale radius based on zoom, relative unit size, hover
var defaultRadius = [
	"interpolate",
	["exponential", 1.75],
	["zoom"],
	8, 
	["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 10, 100, 20],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 2, 100, 10]
	],
	16, 
	["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 12, 100, 24],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 4, 100, 20]
	],
	22, ["case",
		["boolean", ["feature-state", "hover"], false],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 200, 100, 400],
		["interpolate", ["linear"], ["get", relativeSizeColumn], 0, 180, 100, 900]
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
