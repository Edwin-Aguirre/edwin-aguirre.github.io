/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				var $gallery = $('#two');

				$gallery.poptrox({
					caption: function($a) { 
						var title = $a.siblings('h3').text();
						var playUrl = $a.attr('data-playlink');
						
						if (playUrl) {
							// 1. Create the Play Game button inside the lightbox caption
							var $btn = $('<button>', {
								class: 'button play-btn',
								text: 'Play Game',
								style: 'margin-left: 20px; font-size: 0.65em; height: 2.55em; line-height: 2.55em; padding: 0 1em; cursor: pointer;'
							});

							// 2. When clicked, switch from Poptrox to Custom Game Player
							$btn.on('click', function(e) {
								e.preventDefault();
								e.stopPropagation();
								
								// Shut down Poptrox completely to avoid control conflicts
								$gallery.trigger('poptrox_close');
								
								// Build a dedicated, full-screen Game Modal overlay
								var $overlay = $('<div>').css({
									'position': 'fixed',
									'top': '0', 'left': '0', 'width': '100vw', 'height': '100vh',
									'background': 'rgba(44, 44, 44, 0.95)', // Matches the Strata dark theme
									'z-index': '999999',
									'display': 'flex',
									'flex-direction': 'column',
									'align-items': 'center',
									'justify-content': 'center',
									'opacity': '0',
									'transition': 'opacity 0.3s ease'
								});

								// Add a foolproof Close button
								var $closeBtn = $('<div></div>').css({
									'position': 'absolute', 'top': '30px', 'right': '40px',
									'color': '#F5F5E9', 'font-size': '1.2em', 'font-weight': 'bold', 
									'cursor': 'pointer', 'text-transform': 'uppercase', 
									'letter-spacing': '1px', 'z-index': '1000000'
								});

								// Create a massive container for the game (matches the size of a full image)
								var $iframeContainer = $('<div>').css({
									'width': '85vw',
									'max-width': '1200px', // Prevents it from looking stretched on ultrawide monitors
									'aspect-ratio': '16 / 9',
									'background': '#000',
									'border-radius': '6px',
									'box-shadow': '0 0 40px rgba(0,0,0,0.8)'
								});

								var $iframe = $('<iframe>', {
									src: playUrl,
									frameborder: '0',
									scrolling: 'no',
									allowfullscreen: true
								}).css({ 'width': '100%', 'height': '100%', 'border-radius': '6px' });

								// Assemble the pieces and put them on the screen
								$iframeContainer.append($iframe);
								$overlay.append($closeBtn).append($iframeContainer);
								$('body').append($overlay);

								// Smoothly fade it in
								setTimeout(function() { $overlay.css('opacity', '1'); }, 50);

								// 3. Destroy the game safely when clicking the X or the dark background
								$overlay.on('click', function(evt) {
									if (evt.target === this || evt.target === $closeBtn[0]) {
										$overlay.css('opacity', '0');
										// Wait for fade-out, then completely erase the game from the page memory
										setTimeout(function() { $overlay.remove(); }, 300);
									}
								});
							});

							return $('<span>').text(title + ' ').append($btn);
						}
						
						return title; 
					},
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: true, 
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

})(jQuery);