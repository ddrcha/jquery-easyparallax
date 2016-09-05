// Easy Parallax plugin for jQuery 
// =============
// Author : David Richart
// v1.0.0 created the September, 4th 2016
// Plugin licensed under the CC BY-ND 2.0 license
// Git webpage : https://github.com/davidrichart/jquery-easyparallax
// Description: A lightweight, easy-to-use, jQuery plugin for adding a simple vertical parallax background

(function($)
{ 
	$.fn.easyParallax = function(options)
	{     
		var ep = this;
	
		var defaultOptions =
		{
			'debug'      		: false,							// display data debug through browser console
			'alignment'     	: 'center',							// alignement of the bg compared to the main block
			'effectAmount'  	: 400,								// the value of the parallax effect
			'effectThreshold' 	: 0,								// The min screen width value beyond which the effect works
			'isReady'   		: function(el){}					// callback when parallax bg is loaded and added to stage								
		};  
          
		var params = $.extend(defaultOptions, options);
				
		if (params.debug){
			console.log("EasyParallax | INIT | Plugin launched");
			console.log("EasyParallax | INIT | Main parameters loaded : debug : '"+params.debug+"', alignment : '"+params.alignment+"', effectAmount : '"+params.effectAmount+"', effectThreshold : '"+params.effectThreshold+"'");
		}
			
		// -|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-| 
		//   	 Internal functions 			
		// -|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-| 
					
		/* -- Method to optimize the window resize event used into the plugin (©Underscore.js)	*/	
		var debounce = function(func, wait, immediate) {
			var timeout;
			
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait || 200);
				if ( callNow ) { 
					func.apply(context, args);
				}
			};
		};
		
	
		/* -- Method to adapt the img bg to the browser screen and parent element	*/
		var adaptDimensions = function(mainBlock){
			var imgBlock = mainBlock.find('.easyparallax');

			// get main block dimensions and ratio (including a )
			var blockWidth = mainBlock.width();
			var blockHeight = mainBlock.height();
			
			if (ep.parallaxActived()) var blockHeight = blockHeight + params.effectAmount;	
			
			var blockRatio =  blockWidth / blockHeight;
				
			// get img dimensions and ratio	
			var imgWidth = imgBlock.find('img').get(0).naturalWidth; 
			var imgHeight = imgBlock.find('img').get(0).naturalHeight; 
			
			var imgRatio = imgWidth / imgHeight;
			
			// get and set new img dimensions to cover main block
			var iWidth = iHeight = 0;	
			if (blockRatio < imgRatio){
				iHeight = parentHeight = blockHeight;
				iWidth = (imgWidth * blockHeight) / imgHeight;
			
			}else if (blockRatio > imgRatio){
				iWidth = blockWidth;
				iHeight = (imgHeight * blockWidth) / imgWidth;
			
			}else{
				iWidth = blockWidth;
				iHeight = blockHeight;	
			}
			
			imgBlock.css('width', iWidth);
			imgBlock.css('height', iHeight);	
			
			// set bg left position following the 'alignment' option
			switch(params.alignment){
				case 'left' :
					imgBlock.css('left', 0);
					break;
				case 'center' :
					var xPosition = Math.ceil((iWidth - blockWidth) / 2);
					imgBlock.css('left', -xPosition);
					break;
				case 'right' :
					var xPosition = Math.ceil(iWidth - blockWidth);
					imgBlock.css('left', -xPosition);
					break;
			}			
		}
		
		/* -- Method to select the correct img bg based to the browser width and the backgrounds user list */
		this.getCorrectBg = function(bgs){
			var windowWidth = $(window).innerWidth();
			var selectedBgId = false;
			
			for (i in bgs) {
				if (windowWidth >= i) selectedBgId = bgs[i];
			}
			
			return selectedBgId;
		}
					
		
		/* -- Method to return if the browser width threshold (where the parallax effect is activated) is spent or not */
		this.parallaxActived = function(){
			var windowWidth = $(window).innerWidth();

			if (windowWidth > params.effectThreshold) return true;
			else return false;	
		}	
		
		/* -- Method to move the bg based to the coordinates of the scrollbar on the screen */
		this.moveBg = function(mainBlock){
			var imgBlock = mainBlock.find('.easyparallax');
			
			if (ep.parallaxActived() ){
				var windowTop = $(window).scrollTop(); 
				var windowBottom = $(window).scrollTop() + $(window).height(); 
				
				var elementTop = mainBlock.position().top;
				var elementBottom = elementTop + mainBlock.height(); 
				
				var visibleHeight = (elementBottom - elementTop) + ($(window).height());
				
				if (windowBottom >= elementTop && windowTop <= elementBottom){
					var ratio = (windowBottom - elementTop) * 100 / visibleHeight;
					ratio = Math.round(ratio);
					if (ratio < 0) ratio = 0;
					else if (ratio > 100) ratio = 100;
					
					var imgHeight = imgBlock.height();
					var blockHeight = mainBlock.height(); 
					var maxHeight = imgHeight - blockHeight;
					
					var offset = -(maxHeight * ratio / 100);
					imgBlock.css('top', offset);
				}
			
			}else{
				imgBlock.css('top', '0');
			}
		}
		

		// -|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-| 
		//   	      Initialisation			
		// -|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-| 
		
        return this.each(function()
		{
			var mainBlock = $(this); // save main element
			
			mainBlock.css('position', 'relative'); // browser hack
			mainBlock.css('overflow', 'hidden');
			
			var meClasses = $(this).attr('class');

			var meDatas = $(this).data();

			var bgs = [];
			
			var actualBgPath = '';


			/** ******************* **/
			/**   Get all bg datas  **/
			/** ******************* **/
			
			for (var key in meDatas) {
				if (key.substr(0,2) == "bg"){
					var suffix = key.substr(2);
					if (suffix == "") suffix = 0;
					else suffix = parseInt(suffix);
					
					if ($.isNumeric(suffix)) bgs[suffix] = [meDatas[key]];
					else{
						if (params.debug) console.log("EasyParallax | INIT | Element : '" + meClasses + "' | '"+key+"' attribut isn't well-formed");
					}	
				}
			}	

			if (!bgs[0]){
				if (params.debug) console.log("EasyParallax | ERROR | Element : '" + meClasses + "' | 'data-bg' attribut is missing");
				return;
			}
			

			
			/** ******************* **/
			/** Create parallax bg  **/
			/** ******************* **/
			
			mainBlock.prepend('<div class="easyparallax"><img src alt="bg parallax" title="bg parallax" style="width:100%; height:100%;"></div>');
			mainBlock.find('.easyparallax').css('position', 'absolute');
			mainBlock.find('.easyparallax').css('top', '0');
			mainBlock.find('.easyparallax').css('left', '0');
			
			if (params.debug){
				console.log("EasyParallax | INIT | Element : '" + meClasses + "' | Parallax structure created");
			}
			
			var imgPath = ep.getCorrectBg(bgs);
			
			actualBgPath = imgPath;
						
			mainBlock.find('.easyparallax img')
				.on('load', function() { 
					if (params.debug) console.log("EasyParallax | INIT | Element : '" + meClasses + "' | Loaded image : '"+ imgPath + "'");
					params.isReady.call(mainBlock.find('.easyparallax'));	
					
					adaptDimensions(mainBlock);	
					ep.moveBg(mainBlock);
				})
				.on('error', function() { 
					if (params.debug && imgPath != false) console.log("EasyParallax | ERROR | Element : '" + meClasses + "' | Image '"+ imgPath +"' doesn't exist");
				})
				.attr('src', imgPath);
				
			
				
			/** ******************* **/
			/** 	Active events   **/
			/** ******************* **/
			
			$(window).on('resize', debounce(
				function() {
					var imgPath = ep.getCorrectBg(bgs);
					if (imgPath != actualBgPath){
						actualBgPath = imgPath;

						mainBlock.find('.easyparallax img')
							.on('load', function() { 
								if (params.debug) console.log("EasyParallax | INIT | Element : '" + meClasses + "' | Loaded image : '"+ imgPath + "'");

								adaptDimensions(mainBlock);	
							})
							.on('error', function() { 
								if (params.debug && imgPath != false) console.log("EasyParallax | ERROR | Element : '" + meClasses + "' | Image '"+ imgPath +"' doesn't exist");
								})
								.attr('src', imgPath);

					}else{
						adaptDimensions(mainBlock);	
					}
				}, 100));
			
			$(window).scroll(function() {
				ep.moveBg(mainBlock);
			});
		});	
	};	
})(jQuery);


