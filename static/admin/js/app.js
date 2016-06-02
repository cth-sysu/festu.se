/* app.js with site functionality */
angular.module('festu-admin', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'admin/views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'ctrl'
    })
    .otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function($rootScope, $http, $filter) {
    $rootScope.active = null;
    this.test = 'Tjoho'
  });