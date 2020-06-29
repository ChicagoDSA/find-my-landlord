function checkIE() {
	if (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0) {
		// Browser is IE
    	return true;
	} else {
		// Browser isn't IE
		return false;
	};
};
