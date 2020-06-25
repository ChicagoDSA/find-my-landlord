window.addEventListener("load", 
	function() { 
		setTimeout(function () {
        	let viewheight = window.innerHeight;
        	let viewwidth = window.innerWidth;
        	let viewport = document.querySelector("meta[name=viewport]");
        	viewport.setAttribute("content", "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0");
    	}, 300);
	}, false);