function setColors(feature) {
	var count = feature.properties["Properties Held by Owner"];

	if (count < 5) {
		return blue;
	} else if (count < 50) {
		return pink;
	} else if (count < 200) {
		return red;
	} else {
		return yellow;
	};
};

function setSecondaryColors(feature) {
	var count = feature.properties["Properties Held by Owner"];

	if (count < 5) {
		return "#000d33";
	} else if (count < 50) {
		return "#000000";
	} else if (count < 200) {
		return "#4d0000";
	} else {
		return "#000000";
	};
};
