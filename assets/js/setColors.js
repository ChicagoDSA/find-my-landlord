function setColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count < 5) {
		return green;
	} else if (count < 50) {
		return pink;
	} else if (count < 200) {
		return red;
	} else if (count >= 200) {
		return yellow;
	} else {
		// Keep default
		return;
	};
};

function setRowColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count < 5) {
		return "rgba(51, 204, 51, .1)";
	} else if (count < 50) {
		return "rgba(255, 0, 255, .1)";
	} else if (count < 200) {
		return "rgba(255, 77, 77, .1)";
	} else if (count >= 200) {
		return "rgba(255, 255, 0, .1)";
	} else {
		// Keep default
		return;
	};
};
