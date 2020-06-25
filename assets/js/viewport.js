window.addEventListener("load", 
	function() { 
		setTimeout(function () {
        	var viewheight = window.innerHeight;
        	var viewwidth = window.innerWidth;
        	var viewport = document.querySelector("meta[name=viewport]");
        	viewport.setAttribute("content", "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0");
    	}, 300);
	}, false);