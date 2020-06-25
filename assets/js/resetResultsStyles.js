function resetSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
};

function resetPointStyles() {
	if (typeof markerContainer !== "undefined") {
		// Remove marker
		markerContainer.parentNode.removeChild(markerContainer);
		markerContainer = undefined;
	};

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"];
		
		// Revert to original style 
		map.setPaintProperty(objAtIndex, "circle-color", setColors(buildings[i]));
		map.setPaintProperty(objAtIndex, "circle-opacity", defaultOpacity);
	};
};
