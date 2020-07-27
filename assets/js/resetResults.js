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
	map.setLayoutProperty("allProperties", "visibility", "visible");

	map.setLayoutProperty("otherProperties", "visibility", "none");
	map.setFilter("otherProperties", null);

	map.setLayoutProperty("relatedProperties", "visibility", "none");
	map.setFilter("relatedProperties", null);

	map.setLayoutProperty("selectedProperty", "visibility", "none");
	map.setFilter("selectedProperty", null);
};

function resetSelectedMarker() {	
	if (markerContainer) {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = null;
	};
};
