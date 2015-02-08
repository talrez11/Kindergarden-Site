/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};


function Videos_gallery() {
	var self = this;

	self.paused = false;
	self.timer_id = null;
	self.index = 0;
	self.container = null;
	self.images = null;

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// configure container
		self.container = $('div.gallery_container');

		// connect container events
		self.container.hover(self._handle_mouse_enter, self._handle_mouse_leave);

		// configure images
		self.images = self.container.find('a.image.direct');
		self.images.css({
				position: 'absolute',
				top: 0,
				right: 0
			});

		// make container height match elements
		self.container.css('height', self.images.height());

		// implement controls
		self.container.find('a.arrow.previous')
				.css('z-index', 1000)
				.click(self._handle_next);
		self.container.find('a.arrow.next')
				.css('z-index', 1000)
				.click(self._handle_previous);

		// start regular intervals
		self.timer_id = setInterval(self._handle_interval, 7000);

		// position images
		self.update_image_positions();
	}

	/**
	 * Handle clicking on previous arrow.
	 *
	 * @param object event
	 */
	self._handle_previous = function(event) {
		event.preventDefault();
		self.shift_images(false);
	};

	/**
	 * Handle clicking on next arrow.
	 *
	 * @param object event
	 */
	self._handle_next = function(event) {
		event.preventDefault();
		self.shift_images(true);
	};

	/**
	 * Handle mouse entering container.
	 *
	 * @param object event
	 */
	self._handle_mouse_enter = function(event) {
		self.paused = true;
	};

	/**
	 * Handle mouse leaving container.
	 *
	 * @param object event
	 */
	self._handle_mouse_leave = function(event) {
		self.paused = false;
	};

	/**
	 * Handle regular interval.
	 */
	self._handle_interval = function() {
		if (self.paused)
			return;

		self.index++;
		if (self.index >= self.images.length)
			self.index = 0;

		// move images by one
		self.shift_images(true);
	};

	/**
	 * Shift image array to either direction.
	 *
	 * @param boolean to_left
	 */
	self.shift_images = function(to_left) {
		var images = self.images.toArray();

		if (to_left)
			var leftover = images.pop(); else
			var leftover = images.shift();

		// prevent transition animation
		$(leftover).addClass('transit');

		// add back image
		if (to_left)
			images.splice(0, 0, leftover); else
			images.push(leftover);

		self.images = $(images);
		self.update_image_positions(leftover);
	};

	/**
	 * Calculate new image positions.
	 */
	self.update_image_positions = function(leftover) {
		var width = self.images.width();

		for (var i=0, count=self.images.length; i < count; i++) {
			var image = self.images.eq(i);
			image.css('right',width * i + (10 * i));
		};

		if (leftover === undefined)
			var leftover = self.images.eq(0);

		self.images.not(leftover).removeClass('transit');
	};

	// finalize object
	self._init();
};
/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	new Videos_gallery();

	if ($('div.tips_container div.article').length > 1) {
		Caracal.testimonial_pages = new PageControl('div.tips_container', 'div.article')
			.setInterval(10000)
			.setWrapAround(true)
			.setPauseOnHover(true)
			.attachNextControl($('div.tips_container a.arrow.next'))
			.attachPreviousControl($('div.tips_container a.arrow.previous'));
	}

	Caracal.lightbox = new LightBox('a.image.direct', false, false, true);
};


// connect document `load` event with handler function
$(Site.on_load);
