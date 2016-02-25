/* jshint -W117 */
var APP_DATA = {
	'appTitle': 'MasterPass',
	'binCaptureHeading': 'Welcome',
	'binCaptureSubHeading': 'Lets get the information',
	'cardNotAcceptedError': 'Please try an accepted card brand.',
	'cardNotAcceptedHeading': 'Oops!',
	'cardNotAcceptedSubHeading': 'This card isnt accepted by the merchant. ',
	'cardLabel': 'Card',
	'cardPlaceholder': '13-19 Digits',
	'changeUsername': 'Change',
	'chooseLocaleLabel': 'Choose locale',
	'continue': 'Continue',
	'cvcLabel': 'CVC',
	'cvcPlaceholder': '3-4 Digits',
	'emailEntryHeading': 'You are on Your Way to Paying with Masterpass',
	'emailEntrySubHeading': 'Give us the following piece of information',
	'expirationLabel': 'Exp Date',
	'expirationPlaceholder': 'MM/YY',
	'privacyPolicy': 'Privacy Policy',
	'termsAndConditions': 'Terms & Conditions',
	'usernameLabel': 'Username',
	'usernamePlaceholder': 'Email or Phone Number',
	'loggerConsoleLevels': 'error,warn,info,debug',
	'loggerRemoveLevels': 'error,warn,info',
	'loggerRemotePath': '/api/logger',
	'appErrorPrefix': '[phoenix Error]',
	'locales': [
		{
			'label': 'English',
			'value': 'en-us'
		},
		{
			'label': 'English',
			'value': 'en-ca'
		},
		{
			'label': 'Français',
			'value': 'fr-ca'
		},
		{
			'label': 'Español',
			'value': 'es-es'
		}
	],
	'phoenixEnabled': true
};

describe('ShellController', function() {

	var ShellController, sandbox, $rootScope, $q, scope, $controller,
			canary, app, _buildConfig_, bundleStub, canaryStub,
			config, logger, bundle;

	beforeEach(module('app.layout'));
	beforeEach(module('core.canary'));
	beforeEach(module('app.core'));

	beforeEach(inject(function(
		_$controller_,
		_$rootScope_,
		_$q_,
		_config_,
		_logger_,
		_bundle_,
		_canary_
	) {
		sandbox = sinon.sandbox.create();
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		$q = _$q_;
		config = _config_;
		logger = _logger_;
		bundle = _bundle_;
		canary = _canary_;
		app = APP_DATA;
		_buildConfig_ = {};
		bundleStub = sandbox.stub(bundle, 'get', function() {
			return $q.when(app);
		});
		canaryStub = sandbox.stub(canary, 'get', function() {
			return $q.when(app);
		});
		scope = $rootScope.$new();
		ShellController = $controller('ShellController', {
			$scope: scope,
			buildConfig: _buildConfig_
		});
		it('should have a call the bundle get method', function() {
			ShellController = $controller('ShellController', {
				bundleConfig: app,
				$scope: scope
			});
			scope.$apply();

			expect(bundle.get).to.be.calledTwice;
			expect(bundle.get).to.be.calledWith('text', 'tenant-wallet', 'en-us');
			expect(bundle.get).to.be.calledWith('config', 'tenant-wallet', 'en-us');
		});
	}));

	describe('Shell controller', function() {
		// TODO: setup test to handle canary and bundle requests
		it('should be created successfully', function() {
			expect(ShellController).to.be.defined;
		});
		it('should have an activate method', function() {
			expect(ShellController.activate).isFunction;
		});
		it('should have a setLocale method', function() {
			expect(ShellController.setLocale).isFunction;
		});
		it('should have a changeLocale method', function() {
			expect(ShellController.changeLocale).isFunction;
		});
	});

	describe('When shell controller initializes', function() {
		it('should have following properties`', function() {
			expect(ShellController).to.include.keys('text');
			expect(ShellController).to.include.keys('bundleConfig');
			expect(ShellController).to.include.keys('config');
		});

		it('should be an empty object', function() {
			expect(ShellController.text).to.be.deep.equal({});
			expect(ShellController.bundleConfig).to.be.deep.equal({});
		});

		it('should init locale service from bundle load', function() {
			scope.$broadcast('configBundleLoaded');
			scope.$apply();
			expect(ShellController.bundleConfig).to.be.deep.equal(app);
		});

	});

});
