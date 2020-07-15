var searchResultsLimit = 50;

function matchAddresses(e) {
	var value = e.target.value.trim().toLowerCase();

	// Show "x"
	renderClearButton(value);
	// Reset rendered objects
	resetSearchResults();
	// Reset points
	resetPointStyles();

	if (value != "") {
		// Create empty array of results
		var results = [];

		for (var i = 0; i < json.features.length && results.length < searchResultsLimit+1; i++) {
			// Address at current index
	        var address = json.features[i].properties["Property Address"].trim().toLowerCase();
	    	// Check if this address includes the input text
	        if (address.includes(value)) {
	        	// Add feature to results array
	        	results.push(json.features[i]);
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
			resetPointStyles();
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
		// Restore scrollbar
		searchResultsList.style.overflowY = "scroll";

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
	var item = document.createElement("li");
	var addressText = document.createElement("p");
	var address = feature.properties["Property Address"];

	item.className = "search-result";
	item.tabIndex = 0;
	addressText.innerHTML = address;

	// Highlight part of string that matches input 
	highlightText(searchInput, addressText);

	item.appendChild(addressText);
	if (document.getElementById("limit-message")) {
		// Insert list items before limit message
		searchResultsList.insertBefore(item, document.getElementById("limit-message"))
	} else {
		// Limit doesn't exist
		searchResultsList.appendChild(item);
	};

	// Add click event
	item.onclick = function(){
		selectPoint(feature);
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
