window.addEventListener("resize", function () {
	if (selectedBounds) {	
		fitBounds();
	} else if (marker) {
		centerMap([marker.getLngLat().lng, marker.getLngLat().lat]);
	};
});

function fitBounds() {
	// Get height of top container
	var topPadding = document.getElementById("top-container").offsetHeight+40;
	var rightPadding = document.getElementById("legend").clientWidth+40;
	// Fit map to bounds
	map.fitBounds(selectedBounds, {
		padding: {
			top: topPadding, 
			right: rightPadding,
			bottom: 40, 
			left: 40
		},
		maxZoom: 16
	});
};
