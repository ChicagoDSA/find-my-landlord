function setColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count >= 100) {
		return color4;
	} else if (count >= 10) {
		return color3;
	} else if (count >= 3) {
		return color2;
	} else if (count > 0) {
		return color1;
	} else {
		return black;
	};
};

function setForegroundColor(feature) {
	var count = feature.properties[ownedColumn];

	if (count >= 100) {
		return black;
	} else if (count >= 10) {
		return black;
	} else if (count >= 3) {
		return black;
	} else if (count > 0) {
		return black;
	} else {
		return white;
	};
};

function setRowColors(feature) {
	var count = feature.properties[ownedColumn];

	if (count >= 100) {
		return convertHex(color4, .1);
	} else if (count >= 10) {
		return convertHex(color3, .1);
	} else if (count >= 3) {
		return convertHex(color2, .1);
	} else if (count > 0) {
		return convertHex(color1, .1);
	} else {
		return convertHex(black, .1);
	};
};

function convertHex(hexCode, opacity) {
	var hex = hexCode.replace("#", "");

	if (hex.length === 3) {
		hex += hex;
	};

	var r = parseInt(hex.substring(0, 2), 16),
		g = parseInt(hex.substring(2, 4), 16),
		b = parseInt(hex.substring(4, 6), 16);

	return "rgba("+r+","+g+","+b+","+opacity+")";
};
