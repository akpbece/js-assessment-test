// static list of locales
var STATIC_LIST_OF_LOCALES = [{
	'label': 'English',
	'value': 'en-us'
},{
	'label': 'Español',
	'value': 'es-es'
},{
	'label': 'English',
	'value': 'en-ca'
},{
	'label': 'Français',
	'value': 'fr-ca'
}];

describe('Locale Service Factory', function() {
	var localeService, bundle, ShellController, api, $q, sandbox;

	beforeEach(module('app.core'));
	beforeEach(module('core.localeService'));

	beforeEach(inject(function(_$rootScope_, _localeService_, _bundle_, _$q_, _api_) {
		ShellController = _$rootScope_.$new();
		localeService = _localeService_;
		bundle = _bundle_;
		api = _api_;
		$q = _$q_;

		sandbox = sinon.sandbox.create();

		sandbox.stub(api, 'request', function() {
			var defer = $q.defer();
			defer.resolve({});
			return defer.promise;
		});

	}));

	afterEach(function() {
		sandbox.restore();
	});

	describe('initialization', function() {
		it('should call the setLocale method', function() {
			var setLocaleStub = sinon.spy(localeService, 'setLocale');
			localeService.init('en-us', STATIC_LIST_OF_LOCALES, ShellController);
			expect(setLocaleStub).to.have.been.calledOnce;
			expect(setLocaleStub).to.have.been.calledWith('en-us');
		});
	});

	describe('methods before initialization', function() {
		it('should throw an error if used', function() {
			expect(function() {
				localeService.addFilter('complexFilter', function() {});
			}).to.throw();

			expect(function() {
				localeService.removeFilter('complexFilter');
			}).to.throw();

			expect(function() {
				localeService.getLocales();
			}).to.throw();

			expect(function() {
				localeService.setLocale('en-us');
			}).to.throw();
		});
	});

	describe('methods', function() {
		beforeEach(function() {
			localeService.init('en-us', STATIC_LIST_OF_LOCALES, ShellController);
		});

		describe('addFilter', function() {
			it('should add filter with the given name', function() {
				var expectedResult = [{
					'label': 'English',
					'value': 'en-us'
				}, {
					'label': 'English',
					'value': 'en-ca'
				}];

				localeService.addFilter('complexFilter', function filter(locale) {
					return locale.label === 'English';
				});
				expect(localeService.getLocales()).to.be.deep.equal(expectedResult);
			});
		});

		describe('removeFilter', function() {
			it('should remove filter with the given name', function() {

				localeService.addFilter('complexFilter', function filter(locale) {
					return locale.label === 'English';
				});

				localeService.removeFilter('complexFilter');

				expect(localeService.getLocales()).to.be.deep.equal(STATIC_LIST_OF_LOCALES);
			});
		});

		describe('getLocales', function() {
			beforeEach(function() {
				localeService.addFilter('filter', function filter(locale) {
					return locale.value === 'es-es';
				});
			});

			it('should return the list of filtered locales', function() {
				expect(localeService.getLocales()).to.be.deep.equal([{'label': 'Español', 'value': 'es-es'}]);
			});
		});

		describe('getLocale', function() {
			it('should return the current locale string set via setLocale', function() {
				localeService.setLocale('es-es');
				expect(localeService.getLocale()).to.equal('es-es');
			});
		});

	}); // end 'methods'

});
