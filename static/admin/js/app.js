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
  .controller('PartiesCtrl', function($rootScope, $http, $location, $mdDialog) {
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
      $mdDialog.show({
        controller: 'EditPartyCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/admin/views/edit_party.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: { party, cffc: party.cffc },
        bindToController: true
      })
      .then(function(cffc) {
        party.cffc = cffc;
        party.reload = party.reload || 0;
        party.reload++;
      })
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
  })
  .controller('EditPartyCtrl', function($rootScope, $http, $mdDialog) {
    $rootScope.active = 'parties';
    this.cancel = $mdDialog.cancel;
    this.save = function(cffc, image) {
      $http.put('/api/parties/' + this.party._id, { cffc, image })
      .then(function(res) {
        $mdDialog.hide(cffc);
      });
    };
  })
  .controller('MembersCtrl', function($rootScope, $http, $mdDialog) {
    $rootScope.active = 'members';
    var vm = this;
    $http.get('/api/members')
    .then(function(res) {
      vm.members = res.data;
    });
    this.maillist = function(ev) {
      $mdDialog.show($mdDialog.alert()
      .title('Maillist')
      .textContent(this.members
        .filter(function(member) {
          return member.mail && member.mail.indexOf('@') >= 0;
        })
        .map(function(member) {
          return member.mail;
        }).join(', '))
      .ok('ok').targetEvent(ev));
    };
    this.add = function(ev) {
      $location.url('members/new');
    };
    this.x = function(year) {
      var now = new Date();
      return now.getFullYear() - new Date(year,0,1).getFullYear() -
        (now.getMonth() < 7 ? 1 : 0);
    };
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