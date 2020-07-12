function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();

	// Show "x"
	renderClearButton(value);
	// Reset rendered objects
	resetSearchResults();
	// Reset points
	resetPointStyles();

	if (value != "") {
		// Create list of search results
		var results = json.features.filter(function(feature) {
			var address = feature.properties["Property Address"].trim().toLowerCase();
			// Return feature when trimmed input is found in buildings array
			return address.indexOf(value) > -1;
		});

		// Render list
		console.log("search results populated");
		renderResults(results);
	};
};

function renderClearButton(value) {
	if (checkIE() == false) {
		// Show if input has content
		clearButton.style.display = (value.length) ? "block" : "none";

		// Add listener
		clearButton.onclick = function() {
			// Hide button
			this.style.display = "none";

			// Reset UI
			searchInput.value = "";
			resetSearchResults();
			resetPointStyles();
		};
	};
};

function renderResults(features) {
	if (features.length) {		
		// Results were found
		// Show container
		searchResultsContainer.style.display = "block";
		// Show counter
		searchResultsCounter.style.display = "block";
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
		// Show counter
		searchResultsCounter.style.display = "block";
		// Hide scrollbar
		searchResultsList.style.overflowY = "hidden";

		// Create elements
		var headline = document.createElement("h4");
		var description = document.createElement("p");

		// Set values
		headline.innerHTML = "No search results";
		description.className = "empty-container";
		description.innerHTML = "Sorry, we couldn't find that address. Try something like <b>634 E 50th Pl</b>.";

		// Add content to containers
		searchResultsCounter.appendChild(headline);
		searchResultsList.appendChild(description);
	};
};

function createListItem(feature) {
	var item = document.createElement("div");
	var addressText = document.createElement("p");
	var address = feature.properties["Property Address"];

	item.className = "search-result";
	addressText.innerHTML = address;

	// Highlight part of string that matches input 
	highlightText(searchInput, addressText);

	item.appendChild(addressText);
	searchResultsList.appendChild(item);

	// Add click event
	item.onclick = function(){
		selectPoint(feature);
	};
};

function highlightText(input, destination) {
	var regex = new RegExp(input.value, "gi")
	var response = destination.innerHTML.replace(regex, function(str) {
		return "<b>" + str + "</b>"
	});
	destination.innerHTML = response;
};
