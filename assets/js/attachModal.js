function attachModal(element) {
	// Create containers
	var modal = document.createElement("div");
	var background = document.createElement("div");
	var content = document.createElement("div");
	
	// Title area
	var titleContainer = document.createElement("div");
	var titleText = document.createElement("h3");
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

	// Attributes
	titleText.innerText= "How was this data collected?"
	closeImg.src = "assets/images/times.svg";
	description.innerText = "Content coming soon!";

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

	// Close button
	close.onclick = function() {
		removeModal(modal);
	};

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
