/* app.js with site functionality */
angular.module('festu-admin', ['ngRoute', 'ngMaterial'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      redirect: '/parties'
    })
    .when('/parties', {
      templateUrl: 'views/parties.html',
      controller: 'PartiesCtrl',
      controllerAs: 'ctrl'
    })
    .when('/parties/new', {
      templateUrl: 'views/add_party.html',
      controller: 'AddPartyCtrl',
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
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('purple');
  })
  .controller('PartiesCtrl', function($rootScope, $http, $location) {
    $rootScope.active = 'parties';
    var vm = this;
    $http.get('/api/parties')
    .then(function(res) {
      vm.parties = res.data;
    });
    this.add = function(ev) {
      $location.url('parties/new');
    };
    this.edit = function(ev, party) {
      console.log('TODO: edit', party.name);
    };
  })
  .controller('AddPartyCtrl', function($rootScope, $http, $location) {
    $rootScope.active = 'parties';
    this.save = function(ev) {
      $http.post('/api/parties', this.party)
      .then(function(res) {
        $location.url('/admin/parties');
      });
    };
    // var vm = this;
    // $http.get('/api/parties')
    // .then(function(res) {
    //   vm.parties = res.data;
    // });
  })
  .controller('MembersCtrl', function($rootScope) {
    $rootScope.active = 'members';
  })
  .controller('AboutCtrl', function($rootScope, $http) {
    $rootScope.active = 'about';
    var vm = this;
    $http.get('/api/strings/about')
    .then(function(res) {
      vm.aboutContent = res.data['value'];
    })

    this.submit = function(){
      console.log(this.aboutContent);
      var value = this.aboutContent;
      $http.post('/api/strings/about', {value})
      .then(function(res) {
        console.log(res);
      })
    }
  })
  .controller('ContactCtrl', function($rootScope, $routeParams) {
    $rootScope.active = 'contact';
  })
  .controller('AspaCtrl', function($rootScope) {
    $rootScope.active = 'aspa';
  });