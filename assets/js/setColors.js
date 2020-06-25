function setColors(feature) {
	var count = feature.properties["Properties Held by Owner"];

	if (count < 5) {
		return "#3366ff";
	} else if (count < 50) {
		return "#ff00ff";
	} else if (count < 200) {
		return "#ff4d4d";
	} else {
		return "#ffff00";
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
