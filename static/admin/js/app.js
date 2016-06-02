/* app.js with site functionality */
angular.module('festu-admin', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'ctrl'
    })
    .when('/parties', {
      templateUrl: 'views/parties.html',
      controller: 'PartiesCtrl',
      controllerAs: 'ctrl'
    })
    .when('/members', {
      templateUrl: 'views/members.html',
      controller: 'MembersCtrl',
      controllerAs: 'ctrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'ctrl'
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactCtrl',
      controllerAs: 'ctrl'
    })
    .when('/aspa', {
      templateUrl: 'views/aspa.html',
      controller: 'AspaCtrl',
      controllerAs: 'ctrl'
    })
    .otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
    });
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function($rootScope) {
    this.test = 'Tjoho'
  })
  .controller('PartiesCtrl', function($rootScope) {
  })
  .controller('MembersCtrl', function($rootScope) {
  })
  .controller('AboutCtrl', function($rootScope) {
  })
  .controller('ContactCtrl', function($rootScope) {
  })
  .controller('AspaCtrl', function($rootScope) {
  });