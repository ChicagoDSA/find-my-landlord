function attachModal(element, title, modalContent) {
	// When element is clicked, show modal
	element.onclick = function() {
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
		modal.id = "modal";
		background.id = "modal-background";
		content.id = "modal-content";
		titleContainer.id = "modal-title";
		close.id = "modal-close";
		close.tabIndex = 0;

		// Attributes
		titleText.innerText= title;
		closeImg.src = "assets/images/times.svg";
		description.innerHTML = modalContent;

		// Append elements
		modal.appendChild(background);
		modal.appendChild(content);	
		content.appendChild(titleContainer);
		content.appendChild(close);
		content.appendChild(description);
		titleContainer.appendChild(titleText);
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
			console.log(e.target);
			console.log(background);
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

function removeModal (modal) {
	if (modal) {
		// Remove marker
		modal.parentNode.removeChild(modal);
	};
};
