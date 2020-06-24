function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();
	console.log("key up ["+value+"]");

	// Reset highlighted points
	clearPointStyles();

	// Create list of search results
	var results = buildings.filter(function(feature) {
		const address = feature.properties["Property Address"].trim().toLowerCase();
		// Return feature when trimmed input is found in buildings array
		return address.indexOf(value) > -1;
	});

	// Render list
	console.log("search results populated");
	renderResults(results);
};

function highlightText(input, destination) {
	const regex = new RegExp(input.value, "gi")
	const response = destination.innerHTML.replace(regex, function(str) {
		return "<b>" + str + "</b>"
	});
	destination.innerHTML = response;
};

function renderResults(features) {
	clearSearchResults();

	if (features.length) {		
		// Results were found
		// Show container
		searchResultsContainer.style.display = "block";
		// Restore scrollbar
		searchResultsList.style.overflowY = "scroll";

		// Change language depending on number of results
		if (features.length == 1) {
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search result";
		} else {
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search results";
		};

		// Add ListItems
		features.forEach(function(feature) {
			createListItem(feature);
		});
	} else if (features.length == 0 && searchInput.value != "") {
		// No results found
		// Show container
		searchResultsContainer.style.display = "block";
		// Hide scrollbar
		searchResultsList.style.overflowY = "hidden";

		// Create elements
		const headline = document.createElement("h4");
		const description = document.createElement("p");

		// Set values
		headline.innerHTML = "No search results";
		description.className = "empty-container";
		description.innerHTML = "Sorry, we couldn't find that address. Try something like <b>634 E 50th Pl</b>.";

		// Add content to containers
		searchResultsCounter.appendChild(headline);
		searchResultsList.appendChild(description);
	};

	if (searchInput.value == "") {
		// Input is empty
		clearSearchResults();
	};
};

function createListItem(feature) {
	const item = document.createElement("div");
	const addressText = document.createElement("p");
	const address = feature.properties["Property Address"];

	item.className = "search-result";
	addressText.innerHTML = address;

	// Highlight part of string that matches input 
	highlightText(searchInput, addressText);

	item.appendChild(addressText);
	searchResultsList.appendChild(item);

	// Add click event
	item.onclick = function(){
		highlightPoint(feature);
	};
};

function clearSearchResults() {
	// Hide container
	searchResultsContainer.style.display = "none";

	// Clear counter and list HTML
	searchResultsCounter.innerHTML = "";
	searchResultsList.innerHTML = "";
};

function clearPointStyles() {
	if (typeof marker !== "undefined") {
		// Remove marker
		marker.remove();
		marker = undefined;
	};

	for (var i = 0; i < buildings.length; i++) {
		var objAtIndex = buildings[i].properties["Property Address"];
		
		// Revert to original style 
		map.setPaintProperty(objAtIndex, "circle-color", setColors(buildings[i]));
		map.setPaintProperty(objAtIndex, "circle-opacity", defaultOpacity);
	};
};
