window.addEventListener("resize", function () {
	if (marker) {		
		centerMap(marker.getLngLat());
	}
});
