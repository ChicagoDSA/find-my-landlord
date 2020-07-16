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
		"Affiliated with",
		"Properties owned",
		"Property taxpayer"
	];

	// Create empty rows array
	var rows = [];

	// Create rows
	(function () {
		for (var i = 0; i < list.length; i++) {
	        var temp = [
				list[i].properties["Property Address"],
				list[i].properties["Community Area"],
				list[i].properties["Affiliated With"],
				list.length,
				list[i].properties["Taxpayer"]
			];
			rows.push(temp);
	    };
	}());

	// Create table
	doc.autoTable({
		styles: { font: "ManifoldDSA" },
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
		margin: {top: 30}
		});
	
	// Save with trimmed filename
	doc.save(title.replace(/\s+/g, "")+".pdf");
	console.log("PDF saved");
};
