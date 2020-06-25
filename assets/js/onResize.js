searchInput.addEventListener("focusout", function () {
	console.log("HEY");
	if (marker) {		
		centerMap(marker.getLngLat());
	}
});
