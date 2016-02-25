(function() {
	'use strict';

	angular
		.module('app.directives')
		.directive('mcCarousel', mcCarousel);

	/* @ngInject */
	function mcCarousel(logger) {

		return {
			restrict: 'E',
			link: link,
			templateUrl: function(elem, attr) {
				return 'app/directives/carousel/carousel-' + attr.template + '.html';
			}
		};

		function link($scope, $element) {

			function success(shippingAddresses) {
				// If user only have one address there is no need place info
				// on the carousel
				if (shippingAddresses.length < 2) {
					return;
				} else {
					initializeCarousel($element, shippingAddresses);
				}
			}

			function fail(error) {
				logger.error('Error in initializing carousel directive', error);
			}

			/**
			 * @function initializeCarousel
			 * @description  Initializes the carousel
			 * - Adds the carousel handlers
			 * - Adds responsive/dynamic widths
			 * - Adds carousel buttons
			 */
			function initializeCarousel($element, shippingAddresses) {
				var carouselItemIndex = 0;
				var shippingAddressesLength = shippingAddresses.length;

				var nextCarouselBtn  = $element.find('.js-carousel-next');
				var prevCarouselBtn  = $element.find('.js-carousel-prev');
				var carouselList     = $element.find('.js-carousel-shipping-list');

				// This listens to onRepeatComplete event to know if the ng-repeat is complete as
				// ng-repeat is asynchronous.
				$scope.$on('repeatCompleted', function() {
					var carouselListItem = $element.find('.js-carousel-shipping-list-item');
					var carouselListWidth = (100 * shippingAddressesLength) + '%';
					var carouselListItemWidth = (100 / shippingAddressesLength) + '%';
					carouselList.css('width', carouselListWidth);
					carouselListItem.css('width', carouselListItemWidth);

					// Adds the mc-carousel-loaded when the carousel is fully loaded to
					// display the carousel btns when the carousel is being hovered
					// over. Looks very odd when you over on the carousel without
					// any item on it.
					$element.addClass('mc-carousel-loaded');
				});

				function animateCarousel(carouselItemIndex) {
					var carouselLeftPosition = (-carouselItemIndex * 100) + '%';

					carouselList.animate({
						left: carouselLeftPosition
					});
				}

				/**
				 * @function moveToNextItem
				 * @description  Move the carousel to the next item
				 */
				function moveToNextItem() {
					// If the carousel is on the last index, do nothing
					if (carouselItemIndex === (shippingAddresses.length - 1)) {
						return;
					}
					// Increment carousel counter by 1
					carouselItemIndex++;
					animateCarousel(carouselItemIndex);

					// Send the next shipping address object to controller
					$scope.vm.selectedShippingAddress = shippingAddresses[carouselItemIndex];
				}

				/**
				 * @function moveToPrevItem
				 * @description  Move the carousel to the previous item
				 */
				function moveToPrevItem() {
					// If the carousel is on the first index, do nothing
					if (carouselItemIndex === 0) {
						return;
					}
					// Decrement carousel counter by 1
					carouselItemIndex--;
					animateCarousel(carouselItemIndex);

					// Send the prev shipping address object to controller
					$scope.vm.selectedShippingAddress = shippingAddresses[carouselItemIndex];
				}

				// Carousel Event Handlers
				nextCarouselBtn.hammer().on('tap', moveToNextItem);
				carouselList.hammer().on('swipeleft', moveToNextItem);

				prevCarouselBtn.hammer().on('tap', moveToPrevItem);
				carouselList.hammer().on('swiperight', moveToPrevItem);
			}

			// TODO: Implement carousel data as an attribute of carousel instead
			// of relying on promise which is a good solution too.
			//
			// <mc-carousel template="shipping" data="vm.shipping"></mc-carousel>
			//

			// If suppressShippingAddress is set to true, don't request a
			// shipping destination as we will not display it
			if (!$scope.vm.suppressShippingAddress) {
				$scope.vm.getShippingDestination()
					.then(success, fail);
			}
		}
	}
})();
