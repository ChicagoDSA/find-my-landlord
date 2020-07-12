function attachModal(element) {
	var modal = document.getElementById("data-info-modal");
	var background = document.getElementById("modal-background");
	var close = document.getElementById("modal-close");

	// When element is clicked, show modal
	element.onclick = function() {
		modal.style.display = "block";
	};

	// Close button
	close.onclick = function() {
		modal.style.display = "none";
	};

	// Background click
	window.onclick = function(event) {
		if (event.target == background) {
			modal.style.display = "none";
		};
	};
};
