
'use strict';

var fs = require('fs');

module.exports = {
	setCurrentVariant: setCurrentVariant,
	getCurrentVariant: getCurrentVariant
};

function setCurrentVariant(variantName) {
	return fs.writeFileSync('.variant.txt', variantName);
}

function getCurrentVariant() {
	return fs.readFileSync('.variant.txt').toString();
}
