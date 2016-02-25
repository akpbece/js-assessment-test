module.exports = {
	options: {
		'formatter': 'stylish', // default output style
		'merge-default-rules': false // maintain our own ruleset
	},

	// started from https://github.com/sasstools/sass-lint/blob/master/lib/config/sass-lint.yml
	// see https://github.com/sasstools/sass-lint/tree/develop/docs/rules for rule details
	// set 2 for error, 1 for warn, 0 for disable.  generally they should error.
	rules: {
		// extends rules
		'extends-before-mixins': 2,
		'extends-before-declarations': 2,
		'placeholder-in-extend': 2,

		// mixin rules
		'mixins-before-declarations': 2,

		// spacing
		'one-declaration-per-line': 2,
		'empty-line-between-blocks': 0, // allow more spacing
		'single-line-per-selector': 2,

		// disallow
		'no-color-keywords': 2, // use hex values
		'no-color-literals': 2,
		'no-css-comments': 0, // allow css comments
		'no-debug': 2,
		'no-duplicate-properties': 2,
		'no-empty-rulesets': 2,
		'no-extends': 0, // allow extends
		'no-ids': 0, // allow ids
		'no-important': 2,
		'no-invalid-hex': 2,
		'no-mergeable-selectors': 2,
		'no-misspelled-properties': [2, {
			'extra-properties': [] // add non-standard properties here as necessary
		}],
		'no-qualifying-elements': [1, {
			'allow-element-with-class': true,
			'allow-element-with-id': true,
			'allow-element-with-attribute': true
		}],
		'no-trailing-zero': 0,
		'no-transition-all': 2,
		'no-url-protocols': 2,
		'no-vendor-prefixes': 2, // use autoprefixer instead
		'no-warn': 2,

		// nesting - dont require nesting
		'force-attribute-nesting': 0,
		'force-element-nesting': 0,
		'force-pseudo-nesting': 0,

		// name formats
		'function-name-format': [2, {
			'convention': 'hyphenatedlowercase'
		}],
		'mixin-name-format': [2, {
			'convention': 'hyphenatedlowercase'
		}],
		'placeholder-name-format': [2, {
			'convention': 'hyphenatedlowercase'
		}],
		'variable-name-format': [2, {
			'convention': 'hyphenatedlowercase'
		}],

		// style guide
		'border-zero': 2,
		'brace-style': [2, {
			'style': '1tbs',
			'allow-single-line': false
		}],
		'clean-import-paths': 2,
		'empty-args': 2,
		'hex-length': 2,
		'hex-notation': 2,
		// TODO: work out how to enforce tabs instead of spaces:
		// https://github.com/sasstools/sass-lint/issues/62
		// This plugin has issue with tabs - disabling it for now til
		// they fix it
		'indentation': [0, {
			'size': 1
		}],
		'leading-zero': 2,
		'nesting-depth': 2,
		'property-sort-order': 0, // could enforce this, but not alphabetical please
		'quotes': 2, // single quote only
		'shorthand-values': 2,
		'url-quotes': 2,
		'variable-for-property': 2,
		'zero-unit': 2,

		// inner spacing
		'space-after-comma': 2,
		'space-before-colon': 2,
		'space-after-colon': 2,
		'space-before-brace': 2,
		'space-before-bang': 2,
		'space-after-bang': 2,
		'space-between-parens': 2,

		// final
		'trailing-semicolon': 2,
		'final-newline': 2
	}
};
