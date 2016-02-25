/* jshint -W117, -W030 */

describe('Registration Collision Controller', function() {
	var controller,
		sandbox,
		scope,
		stateparams;

	var profile = {
		contactDetails:{
			emailAddress: 'test@test.com',
			mobilePhone:{
				countryCode: '1',
				phoneNumber: '123123123'
			}
		},
		name:{
			first: 'Member',
			last: 'Demo'
		}
	};

	stateparams = {secondaryCredentialType: 'phone'};

	beforeEach(function() {
		bard.appModule('registrationCollision');
		bard.inject('$controller', '$rootScope', '$log', 'flowstack', '$timeout', '$interpolate', 'session', '$stateParams');
		session.set('form.userInformation',profile);

		scope = $rootScope.$new();
		scope.app = {
			text: {
				signInWithExistingSecondaryCredential: 'Sign Into Existing {{secondaryCredentialType}} Account',
				registerUsingNewSecondaryCredential: 'Register Using New {{secondaryCredentialType}}',
				registrationCollisionContent1: 'It appears your {{secondaryCredentialType}} is associated with an existing account.'
			}
		};

		sandbox = sinon.sandbox.create();

		controller = $controller('RegistrationCollisionController', {
			$scope: scope,
			$stateParams:stateparams
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	bard.verifyNoOutstandingHttpRequests();

	it('should be created successfully', function() {
		expect(controller).to.be.defined;
	});

	describe('After activate', function() {

		beforeEach(function() {
			stateparams = {secondaryCredentialType: 'email'};

			controller = $controller('RegistrationCollisionController', {
				$scope: scope,
				$stateParams: stateparams
			});
		});

		it('should have title of registrationCollision', function() {
			expect(controller.title).to.equal('Registration Collision');
		});

		it('should have an activate method', function() {
			expect(controller.activate).isFunction;
		});

	});

	describe('On sign into existing account button clicked', function() {

		it(' Flow stack should be called successfully', function() {
			sandbox.stub(flowstack, 'use', function() {
				return this;
			});

			controller.signIntoExistingAccount();
			expect(flowstack.use).to.be.called;
		});

	});

	describe('On register using new account button clicked', function() {

		it('Flow stack should be called successfully', function() {
			sandbox.stub(flowstack, 'add', function() {
				var self = this;
				var priorityStack = [];
				priorityStack.push.apply(priorityStack, arguments);
				return self;
			});

			controller.registerUsingNewUsername();
			expect(flowstack.add).to.have.been.calledOnce;
		});

	});

});
