window.onresize = function(){
	if (marker) {		
		centerMap(marker.getLngLat());
	}
};
