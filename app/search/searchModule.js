;(function () {
    'use strict';

    angular.module('app.search', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/search', {
                templateUrl: 'search/search.html'
            });
        }]);
})();
