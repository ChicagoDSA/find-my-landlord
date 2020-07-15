function attachModal(element, title, modalContent) {
	// When element is clicked, show modal
	element.onclick = function() {
		// Disable background elements
		disableFocus("map");
		disableFocus("top-container");

		// Create containers
		var modal = document.createElement("div");
		var background = document.createElement("div");
		var content = document.createElement("div");
		var scrollArea = document.createElement("div");
		
		// Title area
		var titleContainer = document.createElement("div");
		var titleText = document.createElement("b");
		var close = document.createElement("div");
		var closeImg = document.createElement("img");
		
		// Content
		var text = document.createElement("p");

		// Set IDs
		modal.id = "modal";
		background.id = "modal-background";
		content.id = "modal-content";
		titleContainer.id = "modal-title";
		close.id = "modal-close";
		close.tabIndex = 0;
		scrollArea.id = "modal-scroll-area";
		text.id = "modal-text";

		// Attributes
		titleText.innerText= title;
		closeImg.src = "assets/images/times.svg";
		text.innerHTML = modalContent;

		// Append elements
		modal.appendChild(background);
		modal.appendChild(content);	
		content.appendChild(titleContainer);
		content.appendChild(scrollArea);	
		scrollArea.appendChild(text);
		titleContainer.appendChild(titleText);
		titleContainer.appendChild(close);
		close.appendChild(closeImg);

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
		window.onclick = function(e) {
			if (e.target == background) {
				removeModal(modal);
			};
		};
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
};

function disableFocus(element) {
	// Get elements in container
	var elements = document.getElementById(element).getElementsByTagName("*");
	for (var i = 0; i < elements.length; i++) {
		var currentElement = elements[i];
		// Is focus enabled?
		if (currentElement.tabIndex == 0) {
			// Disable focus
			currentElement.classList.add("disabled-focus");
			currentElement.tabIndex = -1;
		};
	};
};

function hasClass(element, className) {
    return (" " + element.className + " ").indexOf(" " + className+ " ") > -1;
};

function restoreFocus(element) {
	// Get elements in container
	var elements = document.getElementById(element).getElementsByTagName("*");
	for (var i = 0; i < elements.length; i++) {
		var currentElement = elements[i];
		// Is focus disabled?
		if (hasClass(currentElement, "disabled-focus") == true) {
			// Enable focus
			currentElement.classList.remove("disabled-focus");
			currentElement.tabIndex = 0;
		};
	};
};

function removeModal (modal) {
	if (modal) {
		// Remove modal
		modal.parentNode.removeChild(modal);

		// Restore background elements
		restoreFocus("map");
		restoreFocus("top-container");
	};
};
