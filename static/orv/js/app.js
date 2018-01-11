/* app.js with site functionality */
angular.module('festu-orv', ['ngRoute', 'ngMaterial'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      redirectTo: '/members'
    })
    .when('/members', {
      templateUrl: 'views/members.html',
      controller: 'MembersCtrl',
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
  .controller('MembersCtrl', function($rootScope, $http, $location, $mdDialog, $filter) {
    $rootScope.active = 'members';
    var vm = this;
    $http.get('/api/members')
    .then(function(res) {
      vm.members = res.data;
    });
    $http.get('/api/posts')
    .then(function(res) {
      vm.posts = res.data;
    });

    this.maillist = function(ev, filter) {
      var membersFiltered = [];

      if(!filter){
        membersFiltered = $filter('filter')(this.members, filter, false);
      }
      else if(filter.post.symbol == ''){
        membersFiltered = $filter('filter')(this.members, filter.name, false);
      }
      else{
        membersFiltered = $filter('filter')($filter('filter')(this.members, filter.name, false), filter.post.symbol, true);
      }

      $mdDialog.show($mdDialog.alert()
      .title('Maillist')
      .textContent(membersFiltered
        .filter(function(member) {
          return member.mail && member.mail.indexOf('@') >= 0;
        })
        .map(function(member) {
          return member.mail;
        }).join(', '))
      .ok('ok').targetEvent(ev));
    };

    this.memberOrder = function(member) {
      return member.year * 6 - (member.post ? ['6','66','$','‰','A','X'].indexOf(member.post.symbol) : 0);
    };

    this.x = function(year) {
      var now = new Date();
      return now.getFullYear() - new Date(year,0,1).getFullYear() -
        (now.getMonth() < 7 ? 1 : 0);
    };

    this.edit = function(ev, member) {
      $mdDialog.show({
        controller: 'EditMemberCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/orv/views/edit_member.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: { member },
        bindToController: true
      })
    };

    this.filter = function(actual, expected) {
      return !expected || angular.equals(actual, expected);
    };
  })
  .controller('EditMemberCtrl', function($rootScope, $http, $mdDialog, member) {
    $rootScope.active = 'members';
    var vm = this;
  
    this.programmes = [ 'K', 'KfKb', 'Sjö', 'M', 'TD', 'Z', 'E', 'D', 'IT', 'F', 'A', 'V', 'I', 'H' ];
    this.member = member;

    this.cancel = $mdDialog.cancel;
    this.save = function(member) {
      $http.put('/api/members/', { member })
      .then(function(res) {
        $mdDialog.hide(member);
      });
    };
});