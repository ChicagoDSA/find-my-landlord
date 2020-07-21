function resetSearchResults() {
	// Hide counter
	searchResultsCounter.style.display = "none";
	// Hide list
	searchResultsList.style.display = "none";
	// Hide selected property
	selectedContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";

	var noResults = document.getElementById("no-results-container");

	if (noResults) {
		// Remove no results message
		noResults.parentNode.removeChild(noResults);
	};
};

function resetSelectedInfo() {	
	// Restore layer with complete dataset
	map.setPaintProperty("features", "circle-opacity", defaultOpacity);
	map.setPaintProperty("features", "circle-color", defaultColors);
	
	// Remove filters
	map.setFilter("features", null);
	
	// Remove selected layers
	if (map.getLayer("otherPropertiesOwned")) {
		map.removeLayer("otherPropertiesOwned");
		map.removeSource("otherPropertiesOwned");
	};
	if (map.getLayer("selectedProperty")) {
		map.removeLayer("selectedProperty");
		map.removeSource("selectedProperty");
	};
};

function resetSelectedMarker() {	
	if (markerContainer) {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = null;
	};
};
