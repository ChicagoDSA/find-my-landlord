function centerMap (coordinates) {
	// Use height of top container as offset
	var offset = document.getElementById("top-container").offsetHeight/3;
	// Validate coordinates
	if (coordinates.length == 2) {
		map.flyTo({
			center: coordinates,
			offset: [0, offset],
			zoom: setZoom(map.getZoom()),
			essential: true
		});
	};
};

// Set zoom
function setZoom(currentZoom) {
	if (currentZoom>highlightZoom) {
		// Respect user zoom
		return currentZoom;
	} else {
		// Zoom in
		return highlightZoom;
	};
};
