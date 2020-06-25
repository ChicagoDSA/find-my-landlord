function centerMap (coordinates) {
	map.flyTo({
		center: coordinates,
		zoom: setZoom(map.getZoom()),
		essential: true
	});
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
