(function() {

    'use strict';

    var myApp = angular.module('myApp', []);
    myApp.config(function() {});

    myApp.controller('TestArrayController', function($scope) {

        $scope.indexOf = function(arr, item) {

            console.log(arr + item);
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
            return null;
        };

        $scope.sum = function(arr) {
                var sum = 0;

                for (var i = 0, len = arr.length; i < len; i++) {
                    sum += arr[i];
                    console.log("SUM ::" + sum);
                }

                return sum;
            },

            $scope.remove = function(arr, item) {
                var ret = [];

                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] !== item) {
                        ret.push(arr[i]);
                    }
                }
                console.log("REMOVE ::" + ret);
                return ret;
            },

            $scope.removeWithoutCopy = function(arr, item) {
                var i, len;

                for (i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] === item) {
                        arr.splice(i, 1);
                        i = i - 1;
                        len = len - 1;
                    }
                }
                console.log("removeWithoutCopy ::" + arr);
                return arr;
            },

            $scope.append = function(arr, item) {
                arr.push(item);
                console.log("append ::" + arr);
                return arr;
            },

            $scope.truncate = function(arr) {
                arr.pop()
                console.log("truncate ::" + arr);
                return arr;
            },

            $scope.prepend = function(arr, item) {
                arr.unshift(item);
                console.log("prepend ::" + arr);
                return arr;
            },

            $scope.curtail = function(arr) {
                arr.shift(arr);
                console.log("curtail ::" + arr);
                return arr;
            },

            $scope.concat = function(arr1, arr2) {
                console.log("concat ::" + arr1.concat(arr2));
                return arr1.concat(arr2);
            },

            $scope.insert = function(arr, item, index) {
                arr.splice(index, 0, item);
                console.log("insert ::" + arr);
                return arr;
            },

            $scope.count = function(arr, item) {
                var count = 0;

                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] === item) {
                        count++;
                    }
                }
                console.log("count ::" + count);
                return count;
            },

            //$scope.duplicates = function (arr) {
            //    var seen = {};
            //    var dupes = [];
            //
            //    for (var i = 0, len = arr.length; i < len; i++) {
            //        seen[arr[i]] = seen[arr[i]] ? seen[arr[i]] + 1 : 1;
            //    }
            //
            //    for (var item in seen) {
            //        if (seen.hasOwnProperty(item) && seen[item] > 1) {
            //            dupes.push(item);
            //        }
            //    }
            //    console.log("duplicates ::" + dupes);
            //    return dupes;
            //},

            $scope.square = function(arr) {
                var ret = [];

                for (var i = 0, len = arr.length; i < len; i++) {
                    ret.push(arr[i] * arr[i]);
                }
                console.log("square ::" + ret);
                return ret;
            },

            $scope.findAllOccurrences = function(arr, target) {
                var ret = [];

                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] === target) {
                        ret.push(i);
                    }
                }
                console.log("findAllOccurrences ::" + ret);
                return ret;
            }


    });
    myApp.controller('TestAsyncController', function($scope) {

        $scope.async = function(value) {
                var dfd = $.Deferred();
                setTimeout(function() {
                    dfd.resolve(value);
                }, 300);
                return dfd.promise();
            },

            $scope.manipulateRemoteData = function(url) {
                var dfd = $.Deferred();

                $.ajax(url).then(function(resp) {
                    var people = $.map(resp.people, function(person) {
                        return person.name;
                    });
                    dfd.resolve(people.sort());
                });

                return dfd.promise();
            }

    });

}());