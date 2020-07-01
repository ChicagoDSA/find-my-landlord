window.addEventListener("resize", function () {
	if (marker) {	
		map.jumpTo({center: marker.getLngLat()});
	};
});
