/* app.js with site functionality */
angular.module('festu', [
  'ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    })
    .when('/parties', {
        templateUrl: 'views/parties.html',
        controller: 'PartiesCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
    })
    .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
    })
    .otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function() {
  })
  .controller('PartiesCtrl', function() {
  })
  .controller('AboutCtrl', function() {
  })
  .controller('ContactCtrl', function() {
  });