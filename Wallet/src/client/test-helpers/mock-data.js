/* jshint -W079 */
window.mockData = (function() {
	'use strict';
	return {
		getMockStates: getMockStates
	};

	function getMockStates() {
		return [
			{
				state: 'dashboard',
				config: {
					url: '/',
					templateUrl: 'app/dashboard/dashboard.html',
					title: 'dashboard',
					settings: {
						nav: 1,
						content: '<i class="fa fa-dashboard"></i> Dashboard'
					}
				}
			}
		];
	}

	//function sampleMock() {
	//	return [
	//		{sampleOne: 'Haley', sampleTwo: 'Guthrie', sampleThree: 35}
	//	];
	//}

})();
