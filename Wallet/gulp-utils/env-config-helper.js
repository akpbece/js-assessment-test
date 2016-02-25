'use strict';

var readFilesFromDirectory = require('./read-files-from-directory');
var config = require('../gulp.config.js')();
/* jshint -W079 */
var _ = require('lodash');

module.exports = envConfigHelper;

/**
 * @module Gulp Utilities
 * @description Helper method to return an environment config .json file.
 * This is typically written by the CI scripts before we call the build task.
 * @param {String} env - name of the environment to look for in the env-config folder
 * @return {Object} configFile - JSON file with that environments configs.
 * */

function envConfigHelper(env) {
	if (!env) {
		throw new Error(env + '  No environment variable passed to envConfigHelper Function');
	}

	var envConfigFiles = readFilesFromDirectory(config.envConfigFolder);
	var configPath = '../env-config/';
	var configFile = _.endsWith(env, '.json') ? env : env + '.json';

	if (_.contains(envConfigFiles, configFile)) {
		return require(configPath + configFile);
	} else {
		throw new Error(configFile + '  Was not found, unable to load environment configuration');
	}

}
