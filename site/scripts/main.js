/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

var Caracal = Caracal || {};


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


/**
 * Toggle mobile contact form visibility.
 */
function toggle_mobile_contact_form() {
	var contact_form = $('div.contact_form');

	// toggle form visibility
	if (mobile_contact_form_visible) {
		contact_form.slideUp();
		mobile_contact_form_visible = false;

	} else {
		contact_form.slideDown();
		mobile_contact_form_visible = true;

	}
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {

	if ($('div.tips_container div.article').length > 1) {
		Caracal.testimonial_pages = new PageControl('div.tips_container', 'div.article')
			.setInterval(10000)
			.setWrapAround(true)
			.setPauseOnHover(true)
			.attachNextControl($('div.tips_container a.arrow.next'))
			.attachPreviousControl($('div.tips_container a.arrow.previous'));
	}

	Caracal.lightbox = new LightBox('a.image.direct', false, false, true);

	if ($('div.gallery_container a').length > 0) {
		gallery = new Caracal.Gallery.Slider();
		gallery
		.images.set_container('div.gallery_container')
		.images.add('a.image')
		.controls.set_auto(3000)
		gallery.images.set_center(true)
		gallery.images.set_spacing(20)
		gallery.images.set_visible_count(3)
		gallery.images.attachNextControl($('div.gallery_container a.arrow.next'))
		gallery.images.attachPreviousControl($('div.gallery_container a.arrow.previous'));
	};
};


// connect document `load` event with handler function
$(Site.on_load);