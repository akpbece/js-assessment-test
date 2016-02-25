describe('Form Validation Factory:', function() {
	var validations, config;

	beforeEach(function() {
		module('app.core');
		module('core.formValidation');
	});

	beforeEach(inject(function(_validations_, _config_) {
		validations = _validations_;
		config = _config_;
	}));

	describe('First Name validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('Mayur')).to.be.true;
		});
		it('should fail if characters less than config.firstNameMinLength', function() {
			config.firstNameMinLength = '2';
			expect(validations.firstNameMinValidator('1')).to.be.false;
		});
		it('should fail if characters more than config.firstNameMaxLength', function() {
			config.firstNameMaxLength = '12';
			expect(validations.firstNameMaxValidator('01234567890123456')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.firstNameMaxValidator()).to.be.true;
			expect(validations.firstNameMinValidator()).to.be.true;
		});
	});

	describe('Last Name validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('Patel')).to.be.true;
		});
		it('should fail if characters less than config.lastNameMinLength', function() {
			config.lastNameMinLength = '2';
			expect(validations.lastNameMinValidator('1')).to.be.false;
		});
		it('should fail if characters more than config.lastNameMaxLength', function() {
			config.lastNameMaxLength = '8';
			expect(validations.lastNameMaxValidator('012345678901')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.lastNameMaxValidator()).to.be.true;
			expect(validations.lastNameMinValidator()).to.be.true;
		});
	});

	describe('Address validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('swaps')).to.be.true;
		});
		it('should fail if characters less than config.addressLine1MinLength', function() {
			config.addressLine1MinLength = '2';
			expect(validations.line1MinValidator('a')).to.be.false;
		});
		it('should fail if characters more than config.addressLine1MaxLength', function() {
			config.addressLine1MaxLength = '8';
			expect(validations.line1MaxValidator('villa park')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.line1MaxValidator()).to.be.true;
			expect(validations.line1MinValidator()).to.be.true;
		});
	});

	describe('City validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('frank')).to.be.true;
		});
		it('should fail if characters less than config.addressCityMinLength', function() {
			config.addressCityMinLength = '2';
			expect(validations.cityMinValidator('w')).to.be.false;
		});
		it('should fail if characters more than config.addressCityMaxLength', function() {
			config.addressCityMaxLength = '8';
			expect(validations.cityMaxValidator('villa park')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.cityMaxValidator()).to.be.true;
			expect(validations.cityMinValidator()).to.be.true;
		});
	});

	describe('Postal Code validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('bob')).to.be.true;
		});
		it('should fail if characters less than config.addressPostalCodeMinLength', function() {
			config.addressPostalCodeMinLength = '2';
			expect(validations.zipMinValidator('w')).to.be.false;
		});
		it('should fail if characters more than config.addressPostalCodeMaxLength', function() {
			config.addressPostalCodeMaxLength = '8';
			expect(validations.zipMaxValidator('split villa')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.zipMaxValidator()).to.be.true;
			expect(validations.zipMinValidator()).to.be.true;
		});
	});

	describe('state validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('GUJ')).to.be.true;
		});
	});

	describe('Phone Number validation', function() {
		it('should pass if there is no value', function() {
			expect(validations.phoneDigitValidator()).to.be.true;
		});
		it('should pass when given 10 digit phone number', function() {
			expect(validations.phoneDigitValidator('1234567890')).to.be.true;
		});
		it('should fail if characters less than config.phoneNumberMinLength', function() {
			config.phoneNumberMinLength = '3';
			expect(validations.phoneNumberMinValidator('1')).to.be.false;
		});
		it('should fail if characters more than config.phoneNumberMaxLength', function() {
			config.phoneNumberMaxLength = '20';
			expect(validations.phoneNumberMaxValidator('0123456789012345678912')).to.be.false;
		});
	});

	describe('Password validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('pass')).to.be.true;
		});
		it('should fail if characters less than config.passwordMinLength', function() {
			config.passwordMinLength = '2';
			expect(validations.passwordMinValidator('t')).to.be.false;
		});
		it('should fail if characters more than config.passwordMaxLength', function() {
			config.passwordMaxLength = '8';
			expect(validations.passwordMaxValidator('Master@123')).to.be.false;
		});
		it('should pass if there is no value in case of min/max character validation', function() {
			expect(validations.passwordMaxValidator()).to.be.true;
			expect(validations.passwordMinValidator()).to.be.true;
		});
	});

	describe('Email validation', function() {
		it('should fail if there is no value', function() {
			expect(validations.required()).to.be.false;
		});
		it('should pass if there is a value', function() {
			expect(validations.required('sample')).to.be.true;
		});
		it('should fail if email is not valid', function() {
			expect(validations.emailValidator('member.demoxyz.com')).to.be.false;
		});
		it('should pas if email is valid', function() {
			expect(validations.emailValidator('member.demo@gmail.com')).to.be.true;
		});
	});

});
