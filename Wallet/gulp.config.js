var args = require('yargs').argv;

args.env = args.env || 'local';
// TODO: verify env exists
var envConfig = require('./env-config/' + args.env + '.json');
var approot = envConfig.approot;

module.exports = function() {
	var client = './src/client/';
	var server = './src/server/';
	var clientApp = client + 'app/';
	var root = './';
	var buildRoot = './build/';
	var specRunnerFile = 'specs.html';
	var tempRoot = './.tmp/';
	var bower = {
		json: require('./bower.json'),
		directory: './bower_components/',
		ignorePath: '../..'
	};
	var nodeModules = 'node_modules';

	var config = {
		/**
		 * Javascript
		 */
		js: {
			// all javascript that we want to vet
			vet: [
				'./*.js',
				'./gulp-tasks/*.js',
				'./gulp-utils/*.js',
				'./src/**/*.js'
			],
			// app js, with no specs or variants
			app: [
				clientApp + '**/app.module.js',
				clientApp + '**/*.module.js',
				clientApp + '**/*.js',
				'!' + clientApp + 'app.conductor.js',
				'!' + clientApp + '**/*.spec.js',
				'!' + clientApp + 'variants/**/**'
			],
			// files to watch for local dev
			watch: [
				clientApp + '**/*.js',
				'!' + clientApp + 'app.conductor.js',
				'!' + clientApp + '**/*.spec.js'
			],
			// order to concat files into
			order: [
				'**/*.module.js',
				'**/variants/app.modules.js',
				'**/*.route.js',
				'**/*.controller.js',
				'**/*.js'
			],
			stubs: [
				bower.directory + 'angular-mocks/angular-mocks.js',
				client + 'stubs/**/*.js'
			]
		},

		/*
		* Html
		* */
		html: {
			all: client + '**/*.html',
			templates: clientApp + '**/*.html',
			index: client + 'index.html',
			vet: [
				clientApp + '**/*.html',
				client + 'index.html'
			],
			// used to build html variants into angular template cache
			common: [
				bower.directory + 'mpass-component-forgeforms/formly-templates/*.html',
				clientApp + 'core/*.html'
			]
		},

		/*
		* Styles
		* */
		styles: {
			all: clientApp + '**/*.scss',
			vet: [
				clientApp + '**/*.scss',
				'!' + clientApp + '**/_sprite.scss' // don't vet the generated sprite sass file
			]
		},
		sassIncludePaths: [
			// this shorthands bower components
			'bower_components/',
			// this shorthands bootstrap-sass assets
			'bower_components/bootstrap/assets/stylesheets/',
			'bower_components/bootstrap-sass/assets/stylesheets/'
		],
		autoprefixer: {
			browsers: [
				'last 2 versions',
				// currently supported browser profiles
				'iOS >= 7',
				'Android >= 4.0.4',
				'IE > 8',
				'Safari >= 7',
				'Firefox >= 25',
				'Chrome >= 30'
			],
			cascade: false
		},
		css: [],
		fonts: [
			bower.directory + 'font-awesome/fonts/**/*.*',
			bower.directory + 'phoenix-component-sass/fonts/**'
		],
		images: client + 'images/**/*.*',
		sprite: {
			imgName: 'sprite.png',
			cssName: '_sprite.scss',
			imgPath: '../images/sprite.png', //this is needed for the urls on the generated sass
			cssPath: clientApp + 'variants/default/styles', //TODO:default for now. Should we do it for each variant?
			cssVarMap: function(sprite) {  // jshint ignore:line
				sprite.name = 'sprite-' + sprite.name;
			},
			algorithm: 'top-down',
			algorithmOpts: {
				sort: false
			},
			padding: 5
		},

		build: {
			root: buildRoot,
			app: buildRoot + approot,
			dir: approot
		},
		temp: {
			root: tempRoot,
			app: tempRoot + approot,
			dir: approot
		},
		root: root,
		client: client,
		server: server,
		source: 'src/',

		/**
		 * Mocks
		 * */
		mocks: root + '/mocks/**/*',

		/**
		 * variants
		 * */
		variant: {
			default: 'default',
			directory: clientApp + 'variants/',
			modulesFile: clientApp + 'variants/app.modules.js'
		},

		/**
		 * optimized files
		 */
		optimized: {
			app: 'app.js',
			lib: 'lib.js'
		},

		/**
		 * uglify config
		 */
		uglify: {
			// only preserve comments that appear on the first line to keep license header
			preserveComments: function(node, comment) {
				return (comment.line === 1);
			},
			compress: {
				'drop_console': true
			}
		},

		/**
		 * plato
		 */
		plato: {
			js: clientApp + '**/*.js'
		},

		/**
		 * browser sync
		 */
		browserReloadDelay: 1000,

		/**
		 * template cache
		 */
		templateCache: {
			options: {
				module: 'app.core',
				root: 'app/',
				standAlone: false
			}
		},

		/**
		 * Bower and NPM files
		 */
		bower: bower,
		packages: [
			'./package.json',
			'./bower.json'
		],

		/**
		 * specs.html, our HTML spec runner
		 */
		specRunner: client + specRunnerFile,
		specRunnerFile: specRunnerFile,

		// Load all modules first before other Angular components and specs
		// Pass all these files to test to karma config to be able to test
		test: {
			coreFilesAndSpecs: [
				clientApp + 'app.module.js',
				clientApp + 'core/**/*.js',
				clientApp + 'config/**/*.js'
			],
			coverage : {
				statements: 85,
				branches: 85,
				functions: 85,
				lines: 85
			}
		},

		/**
		 * The sequence of the injections into specs.html:
		 *  1 testlibraries
		 *      mocha setup
		 *  2 bower
		 *  3 js
		 *  4 spechelpers
		 *  5 specs
		 *  6 templates
		 */
		testlibraries: [
			nodeModules + '/mocha/mocha.js',
			nodeModules + '/chai/chai.js',
			nodeModules + '/mocha-clean/index.js',
			nodeModules + '/sinon-chai/lib/sinon-chai.js'
		],
		specHelpers: [client + 'test-helpers/*.js'],
		specs: [clientApp + '**/*.spec.js'],

		/**
		 * Node settings
		 */
		nodemonPort: 5859,
		nodeServer: './src/server/app.js',
		defaultPort: 8003,
		report: './report',
		envConfigFolder: './env-config/',

		/**
		 * BrowserSync settings
		 */
		browserSyncPort: 3002,
		browserSyncStartPath: ''
	};

	/**
	 * wiredep and bower settings
	 */
	config.getWiredepDefaultOptions = function() {
		return {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	};

	/**
	 * karma settings
	 */
	config.karma = getKarmaOptions();

	return config;

	////////////////

	function getKarmaOptions() {
		var options = {
			preprocessors: {}
		};
		options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
		return options;
	}
};
