window.addEventListener("resize", function () {
	if (marker) {		
		alert(window.innerHeight);
		centerMap(marker.getLngLat());
	}
});
