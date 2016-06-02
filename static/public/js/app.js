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
        controller: 'ContactCtrl'
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
        $filter('date')(sale.startTime, 'd/M');
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
      console.log(res.data);
      vm.parties = res.data;
    });
    // $scope.parties = [];

    // $scope.fetchMoreParties = function(){
    //   vm.parties.push(
    //     {
    //       id: 1,
    //       name: 'Nollkalaset 2016',
    //       date: new Date(),
    //       poster: {
    //         small: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //         large: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //       },
    //       ticketSale: {
    //         sales: [{
    //           startTime: new Date(2016, 7, 22, 12, 0, 0),
    //           endTime: new Date(2016, 7, 22, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)',
    //             'Jupiter (Lindholmen)'
    //           ],
    //           info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
    //         }, {
    //           startTime: new Date(2016, 7, 23, 12, 0, 0),
    //           endTime: new Date(2016, 7, 23, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)'
    //           ],
    //           info: 'Anyone can buy\nMax 8 tickets/person'
    //         }],
    //         note: 'Reserve for changes, >= 18 years'
    //       },
    //       imageURL: 'http://cffc.se/thumbnail/thumb/42354/big.jpg',
    //       cffc: 'http://cffc.se/bilder/2016/valborgskalaset/'
    //     },
    //     {
    //       id: 2,
    //       name: 'Nollkalaset 2015',
    //       date: new Date(),
    //       poster: {
    //         small: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //         large: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //       },
    //       ticketSale: {
    //         sales: [{
    //           startTime: new Date(2016, 7, 22, 12, 0, 0),
    //           endTime: new Date(2016, 7, 22, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)',
    //             'Jupiter (Lindholmen)'
    //           ],
    //           info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
    //         }, {
    //           startTime: new Date(2016, 7, 23, 12, 0, 0),
    //           endTime: new Date(2016, 7, 23, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)'
    //           ],
    //           info: 'Anyone can buy\nMax 8 tickets/person'
    //         }],
    //         note: 'Reserve for changes, >= 18 years'
    //       },
    //       imageURL: 'http://cffc.se/thumbnail/thumb/42332/big.jpg',
    //       cffc: 'http://cffc.se/bilder/2016/valborgskalaset/'
    //     },
    //     {
    //       id: 3,
    //       name: 'Nollkalaset 2014',
    //       date: new Date(),
    //       poster: {
    //         small: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //         large: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
    //       },
    //       ticketSale: {
    //         sales: [{
    //           startTime: new Date(2016, 7, 22, 12, 0, 0),
    //           endTime: new Date(2016, 7, 22, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)',
    //             'Jupiter (Lindholmen)'
    //           ],
    //           info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
    //         }, {
    //           startTime: new Date(2016, 7, 23, 12, 0, 0),
    //           endTime: new Date(2016, 7, 23, 13, 0, 0),
    //           locations: [
    //             'Teknologgården (Johanneberg)'
    //           ],
    //           info: 'Anyone can buy\nMax 8 tickets/person'
    //         }],
    //         note: 'Reserve for changes, >= 18 years'
    //       },
    //       imageURL: 'http://cffc.se/thumbnail/thumb/42337/big.jpg',
    //       cffc: 'http://cffc.se/bilder/2016/valborgskalaset/'
    //     }
    //   );
    // }

    // $scope.fetchMoreParties();
    // $scope.fetchMoreParties();

  })
  .controller('AspaCtrl', function(){
    
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
      console.log(res.data[0]);
      vm.members = res.data;
    });

    // TODO: load from backend
    // this.members = [{
    //   post: {
    //     symbol: '6', name: 'Sexmästare'
    //   },
    //   name: 'Albin Hessleryd',
    //   mail: '6@festu.se',
    //   programme: {
    //     name: 'Z', year: 13
    //   },
    //   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    // }, {
    //   post: {
    //     symbol: '66',
    //     name: 'Sexmästarinna'
    //   },
    //   name: 'Sigge',
    //   mail: '66@festu.se',
    //   programme: {
    //     name: 'D', year: 13
    //   },
    //   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    // }];
  })
  .controller('ContactCtrl', function() {
  });