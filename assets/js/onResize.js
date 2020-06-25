searchInput.addEventListener("onfocusout", function () {
	if (marker) {		
		centerMap(marker.getLngLat());
	}
});
