function resetSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";

	
};

function resetPointStyles(feature) {
	if (markerContainer) {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = null;
	};

	// Restore layer with complete dataset
	map.setPaintProperty("propertyData", "circle-opacity", defaultOpacity);

	// Remove selected layers
	if (map.getLayer("selectedPoint")) {
		map.removeLayer("selectedPoint");
		map.removeSource("selectedPoint");
	};
	if (map.getLayer("relatedPoints")) {
		map.removeLayer("relatedPoints");
		map.removeSource("relatedPoints");
	};
	if (map.getLayer("otherPoints")) {
		map.removeLayer("otherPoints");
		map.removeSource("otherPoints");
	};
};
