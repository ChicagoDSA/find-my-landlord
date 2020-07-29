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

function resetMap() {		
	// Restore default layer
	map.setFilter("allProperties", null);
	map.setPaintProperty("allProperties", "circle-opacity", defaultOpacity);

	// Remove related layer
	if (map.getLayer("relatedProperties")) {
		map.removeLayer("relatedProperties");
		map.removeSource("relatedProperties");
	};

	// Remove marker
	if (markerContainer) {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = null;
	};
};
