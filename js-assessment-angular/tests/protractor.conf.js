exports.config = {
 /* seleniumAddress: 'http://localhost:4444/wd/hub',*/
  specs: ['tests/e2e/*.js'],
    directConnect: true,
  multiCapabilities: [,{
    browserName: 'chrome',
    "chromeOptions": {
      binary: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      args: [],
      extensions: [],
    }
  }]
};
