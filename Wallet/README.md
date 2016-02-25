# Phoenix Wallet

## Application installation from a new machine
    - To clone the repo you will need to have permission/access to Stash

1. Install XCode
    - can get this through the Apple Store or Self Service
2. Install node.js version 4.2.2 via:
    - Install through Node Version Manager (nvm) so you can easily switch node version - https://github.com/creationix/nvm
    - Install from brew - http://blog.teamtreehouse.com/install-node-js-npm-mac (via `brew tap homebrew/versions; brew install homebrew/versions/node4-lts` not just 'brew install node' so you can get 4.x not 5.x+)
    - Install directly from - https://nodejs.org/en/ (not recommended)
3. Clone the project
    - Go to https://fusion.mastercard.com/stash/projects/MPASS/repos/phoenix-wallet/browse
    - Grab the project repo url as it would be different for each user. Look on top-left of site and click on the `...`. Then, click 'Clone' and copy the url.
    - Clone the repo by
        - git clone `<paste the url of repo you copied above>` <projectName | Optional>
4. cd into cloned project folder
5. disable npm ssl validation: `npm config set strict-ssl false` (or perhaps allow MC CA https://docs.npmjs.com/misc/config#ca)
6. run `npm install -g bower gulp@3.8.11 nodemon` (may need to run as sudo user)
    - this will install above node dependencies globally
7. run `npm install` (may need to run as sudo user)
    - this will install node and bower dependencies
8. When prompt by bower to choose a version of angular, 'Unable to find a suitable version for angular, please choose one:'
choose number 2 which is angular#~1.3.8. Some version of angular doesn't work.
9. Run 'gulp test' or 'gulp serve' to verify that project is working.
10. 'gulp or gulp help' will list all gulp task.

>Refer to these [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)


## Running the application

### Linting
- `gulp vet`

    Performs static code analysis on all html, css, javascript files. Runs vet-scripts, vet-styles and vet-templates tasks to lint templates, sass and js files.

- `gulp vet --verbose`

    Displays all files affected and extended information about the code analysis.


### Tests
 - Run the unit tests using `gulp test` (via karma, mocha, sinon).

### Running in dev mode
 - Run the project with `gulp serve`

 - opens it in a browser and updates the browser with any files changes.

### Building the project
 - Build the optimized project using `gulp build`
 - This create the optimized code for the project and puts it in the build folder
 - The build folder is not ignored since it contains the deployable artifacts.

### Running the optimized code
 - Run the optimize project from the build folder with `gulp serve-build`

## Gulp Tasks

### Task Listing

- `gulp help`

    Displays all of the available gulp tasks.

### Code Analysis

- `gulp plato`

    Performs code analysis using plato on all javascript files. Plato generates a report in the reports folder.

### Testing

- `gulp test`

    Runs all unit tests using karma runner, mocha, chai and sinon with phantomjs. Depends on vet task, for code analysis. More information on test task below.


### Cleaning Up

- `gulp clean`

    Remove all files from the build, temp and report folders

### Fonts and Images

- `gulp fonts`

    Copy all fonts from source to the build folder

- `gulp images`

    Copy all images from source to the build folder

### Styles

- `gulp styles`

    Compile less files to CSS, add vendor prefixes, and copy to the build folder

### Bower Files

- `gulp wiredep`

    Looks up all bower components' main files and JavaScript source code, then adds them to the `index.html`.

    The `.bowerrc` file also runs this as a postinstall task whenever `bower install` is run.

### Angular HTML Templates

- `gulp templatecache`

    Create an Angular module that adds all HTML templates to Angular's $templateCache. This pre-fetches all HTML templates saving XHR calls for the HTML.

- `gulp templatecache --verbose`

    Displays all files affected by the task.

### Serving Development Code

- `gulp serve`

    Serves the development code and launches it in a browser. The goal of building for development is to do it as fast as possible, to keep development moving efficiently. This task serves all code from the source folders and compiles less to css in a temp folder.

- `gulp serve --nosync`

    Serves the development code without launching the browser.

- `gulp serve --debug`

    Launch debugger with node-inspector.

- `gulp serve --debug-brk`

    Launch debugger and break on 1st line with node-inspector.

### Building Production Code

- `gulp html`

    Optimize all javascript and styles, move to a build folder, and inject them into the new index.html

- `gulp build`

    Copies all fonts, copies images and runs `gulp html` to build the production code to the build folder.

### Serving Production Code

- `gulp serve-build`

    Serve the optimized code from the build folder and launch it in a browser.

- `gulp serve-build --nosync`

    Serve the optimized code from the build folder and manually launch the browser.

- `gulp serve-build --debug`

    Launch debugger with node-inspector.

- `gulp serve-build --debug-brk`

    Launch debugger and break on 1st line with node-inspector.

### Bumping Versions

- `gulp bump`

    Bump the minor version using semver.
    --type=patch // default
    --type=minor
    --type=major
    --type=pre
    --ver=1.2.3 // specific version

# Unit test
Each test will provide a report folder to see code coverage

> gulp test || gulp test --type all
    - will run karma test for core and all variant

> gulp test --type core
    - will run karma test on core folder only

##### Additional argument:
    --type <variant>
        - possible values are `default`
        - will just run a single test for a specific variant based on the arg provided
    --watch
        -- will add a watcher when spec files or actual files being tested are changed, it will recompile and restart test automagically

        -- this will also provide the dev to debug spec test by opening karma server specified on the terminal console. Copy and paste the url from console and paste it on the browser... http://localhost:9876, etc...


# End to End Test

We use Protractor for end to end test.

> Protractor is an end-to-end test framework for AngularJS applications. Protractor runs tests against your application running in a real browser, interacting with it as a user would. For complete documentation, please read - [angular docs](http://angular.github.io/protractor/#/)

###### Steps: All steps below will need to be run in terminal root project dir

- npm run update:webdriver
    - The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running
    - will install chrome-driver and selenium standalone drivers so we can locally use selenium standalone to be able to test locally

To perform end-to-end test locally you run protractor command, pass in the protractor configuration and a
variant. See an example on running an end-to-end `default` variant below.

- `gulp serve` - Open our application locally

- `gulp e2e` or ./node_modules/protractor/bin/protractor protractor.conf.js --variant default
    - will open a browser and start end to end test
    - this will test all the end to end spec files under `e2e/default` folder
    - If you need to perform e2e test on other variant, just pass in the variant name to protractor like so:

Example:
    ./node_modules/protractor/bin/protractor protractor.conf.js --variant otherVariant
    ./node_modules/protractor/bin/protractor protractor.conf.js --variant moreVariant

Optional: Install protractor globally. You will need to install mocha globally as they need to be in the same level with protractor

`npm install protractor mocha`
    > then you can run

    protractor protractor.conf.js --variant default
    protractor protractor.conf.js --variant otherVariant
    protractor protractor.conf.js --variant moreVariant
