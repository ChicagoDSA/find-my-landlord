function setColors(feature) {
	var count = feature.properties["Properties Held by Affiliated With"];
	console.log(count);

	if (count < 5) {
		return green;
	} else if (count < 50) {
		return pink;
	} else if (count < 200) {
		return red;
	} else if (count >= 200) {
		return yellow;
	} else {
		return gray;
	};
};
