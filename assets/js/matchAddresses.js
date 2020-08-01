var searchResultsLimit = 50;

function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();

	// Show "x"
	renderClearButton(value);
	// Reset rendered objects
	resetSearchResults();
	// Reset UI
	resetMap();

	if (value != "") {
		// Create empty array of results
		var results = [];

		for (var i = 0; i < json.length && results.length < searchResultsLimit+1; i++) {
			// Address at current index
			if (json[i][propertyAddressColumn]) {
				var address = json[i][propertyAddressColumn].trim().toLowerCase();
				// Check if this address includes the input text
				if (address.indexOf(value) > -1) {
					// Add feature to results array
					results.push(json[i]);
				};
			};
		};

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
			resetMap();
		};
		// Accessibility
		clearButton.addEventListener("keypress",
			function(e) {
				// Enter key
				if (e.keyCode == 13) {
					e.target.click();
				};
			}
		);
	};
};

function renderResults(features) {
	if (features.length) {		
		// Results were found
		// Show container
		searchResultsContainer.style.display = "block";
		// Show counter
		searchResultsCounter.style.display = "block";
		// Show list
		searchResultsList.style.display = "block";

		if (features.length > searchResultsLimit) {
			// More results than limit
			searchResultsCounter.innerHTML = "<h4>"+searchResultsLimit+"+ search results";

			var refineMessage = document.createElement("li");
			refineMessage.id = "limit-message";
			refineMessage.innerText = "These are the first "+searchResultsLimit+" results. Don't see your building? Try typing more of your address.";
			searchResultsList.appendChild(refineMessage);
		} else if (features.length > 1 && features.length <= searchResultsLimit) {
			// Less results than limit
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search results";
		} else if (features.length == 1) {
			// 1 result
			searchResultsCounter.innerHTML = "<h4>"+features.length+" search result";
		};

		// Add ListItems
		for (var i = 0; i < searchResultsLimit && i < features.length; i++) {
			// Address at current index
			createListItem(features[i]);
		};
	} else if (features.length == 0 && searchInput.value != "") {
		// No results found
		var title = "No search results";
		var message = "Sorry, we couldn't find that address. If your building is large, it may have multiple addresses. Try locating it on the map.";
		showSearchMessage(title, message);
	};
};

function showSearchMessage(title, message) {
	// Show container
	searchResultsContainer.style.display = "block";
	// Show counter
	searchResultsCounter.style.display = "block";

	// Create elements
	var headline = document.createElement("h4");
	var description = document.createElement("p");

	// Set values
	headline.innerHTML = title;
	description.id = "no-results-container";
	description.innerHTML = message;

	// Add content to containers
	searchResultsCounter.appendChild(headline);
	searchResultsContainer.appendChild(description);
};

function createListItem(feature) {
	var item = document.createElement("li");
	var address = feature[propertyAddressColumn];

	item.className = "search-result";
	item.tabIndex = 0;
	item.innerHTML = address;

	// Highlight part of string that matches input 
	highlightText(searchInput, item);

	if (document.getElementById("limit-message")) {
		// Insert list items before limit message
		searchResultsList.insertBefore(item, document.getElementById("limit-message"))
	} else {
		// Limit doesn't exist
		searchResultsList.appendChild(item);
	};

	// Add click event
	item.onclick = function(){
		async function render() {
			try {
				// Show spinner
				spinner.style.display = "block";

				var selected = await searchProperty(feature[propertyIndexColumn]);
				// Reset UI
				resetMap();
				// Update it
				renderSelectedUI(selected);
				// Log event
				firebase.analytics().logEvent("search-result-clicked", { 
					property_address: selected.properties[propertyAddressColumn],
					taxpayer: selected.properties[taxpayerColumn],
					affiliated_with: selected.properties[affiliatedWithColumn],
				});

				// Hide spinner
				spinner.style.display = "none";
			} catch {
				// Show error message
				resetSearchResults();
				var title = "Database error";
				var message = "Sorry, we couldn't look up that property's details. Try again in an hour, or <a href='mailto:'mailto:tenantscdsa@gmail.com'>contact us</a>."
				showSearchMessage(title, message);

				// Hide spinner
				spinner.style.display = "none";
			};	
		};
		render();
	};
	// Accessibility
	item.addEventListener("keypress",
		function(e) {
			// Enter key
			if (e.keyCode == 13) {
				e.target.click();
			};
		}
	);
};

function highlightText(input, destination) {
	var regex = new RegExp(input.value, "gi")
	var response = destination.innerHTML.replace(regex, function(str) {
		return "<b>" + str + "</b>"
	});
	destination.innerHTML = response;
};
