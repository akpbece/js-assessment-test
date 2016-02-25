describe('TestArrayController', function () {

    var controller = null;
    $scope = null;

    var a;

    beforeEach(function () {
        a = [1, 2, 3, 4];
    });

    beforeEach(function () {
        module('myApp');
    });

    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('TestArrayController', {
            $scope: $scope
        });
    }));


    it('you should be able to determine the location of an item in an array', function () {
        expect($scope.indexOf(a, 3)).to.eql(2);
        expect($scope.indexOf(a, 5)).to.eql(-1);
    });

    it('you should be able to add the values of an array', function () {
        expect($scope.sum(a)).to.eql(10);
    });

    it('you should be able to remove all instances of a value from an array', function () {
        a.push(2); // Make sure the value appears more than one time
        var result = $scope.remove(a, 2);

        expect(result).to.have.length(3);
        expect(result.join(' ')).to.eql('1 3 4');
    });

    it('you should be able to remove all instances of a value from an array, returning the original array', function () {
        a.splice(1, 0, 2);
        a.push(2);
        a.push(2);

        var result = $scope.removeWithoutCopy(a, 2);

        expect(result).to.have.length(3);
        expect(result.join(' ')).to.eql('1 3 4');

        // make sure that you return the same array instance
        expect(result).equal(a);
    });

    it('you should be able to add an item to the end of an array', function () {
        var result = $scope.append(a, 10);

        expect(result).to.have.length(5);
        expect(result[result.length - 1]).to.eql(10);
    });

    it('you should be able to remove the last item of an array', function () {
        var result = $scope.truncate(a);

        expect(result).to.have.length(3);
        expect(result.join(' ')).to.eql('1 2 3');
    });

    it('you should be able to add an item to the beginning of an array', function () {
        var result = $scope.prepend(a, 10);

        expect(result).to.have.length(5);
        expect(result[0]).to.eql(10);
    });

    it('you should be able to remove the first item of an array', function () {
        var result = $scope.curtail(a);

        expect(result).to.have.length(3);
        expect(result.join(' ')).to.eql('2 3 4');
    });

    it('you should be able to join together two arrays', function () {
        var c = ['a', 'b', 'c', 1];
        var result = $scope.concat(a, c);

        expect(result).to.have.length(8);
        expect(result.join(' ')).to.eql('1 2 3 4 a b c 1');
    });

    it('you should be able to add an item anywhere in an array', function () {
        var result = $scope.insert(a, 'z', 2);

        expect(result).to.have.length(5);
        expect(result.join(' ')).to.eql('1 2 z 3 4');
    });

    it('you should be able to count the occurences of an item in an array', function () {
        var result = $scope.count([1, 2, 4, 4, 3, 4, 3], 4);

        expect(result).to.eql(3);
    });

    /*it('you should be able to find duplicates in an array', function() {
     var result = $scope.duplicates([ 1, 2, 4, 4, 3, 3, 1, 5, 3 ]);

     expect(result.sort()).to.eql([1, 3, 4]);
     });*/

    it('you should be able to square each number in an array', function () {
        var result = $scope.square(a);

        expect(result).to.have.length(4);
        expect(result.join(' ')).to.eql('1 4 9 16');
    });

    it('you should be able to find all occurrences of an item in an array', function () {
        var result = $scope.findAllOccurrences('abcdefabc'.split(''), 'a');

        expect(result.sort().join(' ')).to.eql('0 6');
    });

});
describe('TestAsyncController', function () {

    beforeEach(function () {
        module('myApp');
    });
    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('TestAsyncController', {
            $scope: $scope
        });
    }));

    it('you should understand how to use promises to handle asynchronicity', function (done) {
        var flag = false;
        var finished = 0;
        var total = 2;

        function finish(done) {
            if (++finished === total) {
                done();
            }
        }

        $scope.async(true).then(function (result) {
            flag = result;
            expect(flag).to.eql(true);
            finish(done);
        });

        $scope.async('success').then(function (result) {
            flag = result;
            expect(flag).to.eql('success');
            finish(done);
        });

        expect(flag).to.eql(false);
    });

    it('you should be able to retrieve data from the server and return a sorted array of names', function (done) {
        var url = '/data/testdata.json';

        $scope.manipulateRemoteData(url).then(function (result) {
            expect(result).to.have.length(5);
            expect(result.join(' ')).to.eql('Adam Alex Matt Paul Rebecca');
            done();
        });
    });

});