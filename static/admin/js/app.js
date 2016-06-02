/* app.js with site functionality */
angular.module('festu-admin', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'ctrl'
    })
    .otherwise('/');
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function($rootScope) {
    $rootScope.active = null;
    this.test = 'Tjoho'
  });