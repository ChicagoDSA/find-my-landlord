function setColors(feature) {
	console.log("YO"+feature.properties["Properties Held by Owner"]);
	var count = feature.properties["Properties Held by Owner"];

	if (count == "") {
		return gray;
	} else if (count < 5) {
		return blue;
	} else if (count < 50) {
		return pink;
	} else if (count < 200) {
		return red;
	} else if (count >= 200) {
		return yellow;
	};
};

function setSecondaryColors(feature) {
	var count = feature.properties["Properties Held by Owner"];

	if (count == "") {
		return "#000000";
	} else if (count < 5) {
		return "#000d33";
	} else if (count < 50) {
		return "#000000";
	} else if (count < 200) {
		return "#4d0000";
	} else {
		return "#000000";
	};
};
