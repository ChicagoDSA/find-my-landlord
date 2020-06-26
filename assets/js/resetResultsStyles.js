function resetSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";

	
};

function resetPointStyles(feature) {
	if (typeof markerContainer !== "undefined") {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = undefined;
	};
};
