function createPDF(title, list) {	
	// Set global defaults
	jsPDF.autoTableSetDefaults({
		// Black table style
		headStyles: {fillColor: 0},
	});

	// Create PDF
	var doc = new jsPDF({orientation: "landscape"});

	// Set column titles
	var col = [
		"Property address",
		"Community area",
		"Known units",
		"Affiliated with",
		"Properties owned",
		"Property taxpayer"
	];

	// Create empty rows array
	var rows = [];

	// Create rows
	(function () {
		for (var i = 0; i < list.features.length; i++) {
			// Clean up known units
			var knownUnits;
			if (list.features[i].properties[unitColumn] == 0) {
				knownUnits = "--";
			} else {
				knownUnits = list.features[i].properties[unitColumn];
			};

			// Clean up affiliated with
			var affiliatedWith;
			if (list.features[i].properties[affiliatedWithColumn] == 0) {
				affiliatedWith = "--";
			} else {
				affiliatedWith = list.features[i].properties[affiliatedWithColumn];
			};

			// Set row values
	        var temp = [
				list.features[i].properties[propertyAddressColumn],
				list.features[i].properties[communityAreaColumn],
				knownUnits,
				affiliatedWith,
				list.features[i].properties[ownedColumn],
				list.features[i].properties[taxpayerColumn]
			];
			rows.push(temp);
	    };
	}());

	// Create table
	doc.autoTable({
		styles: {font: "ManifoldDSA"},
		columns: col,
		body: rows,
		didDrawPage: function (data) {
  			// Set header
  			doc.setFont("ManifoldDSA");
  			doc.setFontSize(20);
  			doc.setTextColor(40);
  			doc.setFontStyle("bold");
  			doc.text(title, data.settings.margin.left, 20);
		},
		didParseCell: function (data) {
			// Style empty cells
			if(data.section === "body" && data.cell.raw == "--"){
				data.cell.styles.textColor = gray;
			};
		},
		margin: {top: 30}
		});
	
	// Save with trimmed filename
	doc.save(title.replace(/\s+/g, "")+".pdf");
	console.log("PDF saved");
};
