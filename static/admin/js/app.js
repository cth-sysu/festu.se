/* app.js with site functionality */
angular.module('festu-admin', ['ngRoute', 'ngMaterial'])
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
    .otherwise('/');
    $locationProvider.html5Mode({
        enabled: true,
    });
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('purple');
  })
  .controller('PartiesCtrl', function($rootScope) {
    $rootScope.active = 'parties';
  })
  .controller('MembersCtrl', function($rootScope) {
    $rootScope.active = 'members';
  })
  .controller('AboutCtrl', function($rootScope) {
    $rootScope.active = 'about';
  })
  .controller('ContactCtrl', function($rootScope, $routeParams) {
    $rootScope.active = 'contact';
  });