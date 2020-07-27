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
	// Remove filters
	// map.setFilter("features", null);
};

function resetSelectedMarker() {	
	if (markerContainer) {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = null;
	};
};
