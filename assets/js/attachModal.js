function attachModal(element) {
	// Create containers
	var modal = document.createElement("div");
	var background = document.createElement("div");
	var content = document.createElement("div");
	
	// Title area
	var titleContainer = document.createElement("div");
	var titleText = document.createElement("b");
	var close = document.createElement("div");
	var closeImg = document.createElement("img");
	
	// Content
	var description = document.createElement("p");

	// Set IDs
	modal.id = "data-info-modal";
	background.id = "modal-background";
	content.id = "modal-content";
	titleContainer.id = "modal-title";
	close.id = "modal-close";
	close.tabIndex = 0;

	// Attributes
	titleText.innerText= "How was this data collected?"
	closeImg.src = "assets/images/times.svg";
	description.innerHTML = `
		<h5>Note: properties may have changed ownership since the data was initially collected.</h5>
		<p>The <b>property taxpayer</b> and address for buildings in Cook County were scraped from the <a href="https://www.cookcountyassessor.com/address-search">assessor website</a> in November 2019, and filtered to exclude properties not zoned for rental. Properties were matched based on the name and address of the property taxpayer, to find the <b>number of buildings</b> sharing the same taxpayer.</p>
		<p>Matches were then researched and <b>affiliated</b> with particular corporations, managers, or landlords based on information in the <a href="https://www.ilsos.gov/corporatellc/CorporateLlcController">Illinois Secretary of State LLC Search</a> and other public records, including the <a href="https://cookrecorder.com/search-our-records/">Cook County Recorder of Deeds</a>.</p>
	`;

	// Append elements
	modal.appendChild(background);
	modal.appendChild(content);	
	content.appendChild(titleContainer);
	content.appendChild(close);
	content.appendChild(description);
	titleContainer.appendChild(titleText);
	close.appendChild(closeImg);

	// When element is clicked, show modal
	element.onclick = function() {
		document.body.appendChild(modal);	
	};
	// Accessibility
	element.addEventListener("keypress",
		function(e) {
			// Enter key
		    if (e.keyCode == 13) {
		        e.target.click();
		    };
		}
	);

	// Close button
	close.onclick = function() {
		removeModal(modal);
	};
	// Accessibility
	close.addEventListener("keypress",
		function(e) {
			// Enter key
		    if (e.keyCode == 13) {
		        e.target.click();
		    };
		}
	);

	// Background click
	window.onclick = function(event) {
		if (event.target == background) {
			removeModal(modal);
		};
	};
};

function removeModal (modal) {
	if (modal) {
		// Remove marker
		modal.parentNode.removeChild(modal);
	};
};
