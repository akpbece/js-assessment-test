# A test-driven JS assessment

Technologies used : Angular , Karma ,Protractor , Gulp 

Run the app: $ gulp

Test the app : $ gulp test 
----------------------------------------------------------------------

OUTPUT would be as follows on the CONSOLE .

C:\Users\shahbrother\Desktop\Send\js-assessment-angular>gulp test
[18:33:20] Using gulpfile ~\Desktop\Send\js-assessment-angular\Gulpfile.js
[18:33:20] Starting 'test'...
INFO [karma]: Karma v0.12.31 server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
INFO [Chrome 48.0.2564 (Windows)]: Connected on socket MVzZZ4tZq8aWivZJhsrn with id 90226807
LOG: '1,2,3,43'
LOG: '1,2,3,45'
LOG: 'SUM ::1'
LOG: 'SUM ::3'
LOG: 'SUM ::6'
LOG: 'SUM ::10'
LOG: 'REMOVE ::1,3,4'
LOG: 'removeWithoutCopy ::1,3,4'
LOG: 'append ::1,2,3,4,10'
LOG: 'truncate ::1,2,3'
LOG: 'prepend ::10,1,2,3,4'
LOG: 'curtail ::2,3,4'
LOG: 'concat ::1,2,3,4,a,b,c,1'
LOG: 'insert ::1,2,z,3,4'
LOG: 'count ::3'
LOG: 'square ::1,4,9,16'
LOG: 'findAllOccurrences ::0,6'
Chrome 48.0.2564 (Windows): Executed 14 of 15 SUCCESS (0 secs / 0.331 secs)

--------------------------------END OF OUTPUT --------------------------

I have used the Array and Async for now I will update all the tests when I will get the time .

### Available dependencies

The repo includes jQuery, Angular,Karma and Underscore. Do take advantage of these
libraries when writing your solutions!


## I hate \<some technology you've chosen\>

This repo uses [Mocha](http://visionmedia.github.com/mocha/) and
[Chai](http://chaijs.com/) for the tests themselves. It uses the BDD style for authoring tests.
If this doesn't suit you, please fork away, or, better, submit a pull request that lets
this be more flexible than it currently is.


## Note
I will finish another test cases in angular into free time.

## APP JS File detail
TestArrayController and TestAsynController for testing .
## test/spec.js detail
 Here in this file I have written the testcases for the controller.