/* app.js with site functionality */
angular.module('festu', ['ngRoute', 'infinite-scroll', 'ngAnimate'])
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
    .when('/aspa', {
        templateUrl: 'views/aspa.html',
        controller: 'AspaCtrl',
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
        .when('/puffa', {
        templateUrl: 'views/puffa.html',
        controller: 'PuffaCtrl',
        controllerAs: 'ctrl'
    })
    .otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function($rootScope, $http, $filter) {
    $rootScope.active = null;
    this.dates = function(sales) {
      return sales && sales.map(function(sale) {
        return $filter('date')(sale.startTime, 'd/M');
      });
    };
    var vm = this;
    $http.get('/api/parties/next')
    .then(function(res) {
      vm.party = res.data;
    });
  })
  .controller('PartiesCtrl', function($rootScope, $scope, $window, $timeout, $http) {
    $rootScope.active = 'parties';

    $scope.windowWidth = $window.innerWidth;
    $window.onresize = function(event) {
      $timeout(function() {
        $scope.windowWidth = $window.innerWidth;
      });
    };

    var vm = this;
    $http.get('/api/parties')
    .then(function(res) {
      vm.parties = res.data;
    });
  })
  .controller('AspaCtrl', function(){
    
  })
  .controller('PuffaCtrl', function(){
    
  })
  .controller('AboutCtrl', function($rootScope, $http) {
    $rootScope.active = 'about';
    var now = new Date();
    var year = now.getMonth() < 6 ? now.getFullYear() : now.getFullYear() + 1;
    this.festuYear = 
      (year - 1).toString().substr(-2) + '/' + 
      (year).toString().substr(-2);

    var vm = this;
    $http.get('/api/members/current')
    .then(function(res) {
      vm.members = res.data;
    });
  })
  .controller('ContactCtrl', function($http) {
    this.send = function(name, mail, message) {
      var vm = this;
      $http.post('/api/contact', { name, mail, message })
      .then(function(res) {
        vm.sent = true;
        // TODO: Something better
        alert('Thank you! We will get back to you soon.');
      });
    };
  });