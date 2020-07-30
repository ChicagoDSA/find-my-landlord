function setColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count >= 100) {
		return yellow;
	} else if (count >= 10) {
		return red;
	} else if (count >= 3) {
		return pink;
	} else if (count > 0) {
		return blue;
	} else {
		return black;
	};
};

function setRowColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count >= 100) {
		return "rgba(255, 255, 0, .1)";
	} else if (count >= 10) {
		return "rgba(255, 77, 77, .1)";
	} else if (count >= 3) {
		return "rgba(255, 0, 255, .1)";
	} else if (count > 0) {
		return "rgba(51, 153, 255, .1)";
	} else {
		return "rgba(0, 0, 0, .1";
	};
};
