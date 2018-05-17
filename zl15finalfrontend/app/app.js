;(function() {
'use strict'


angular.module('dummy', ['ngRoute', 'ngResource'])
  .config(config)
  .run(communicate_setup)
  ;


function config($routeProvider) {
  $routeProvider
  .when('/Login', {
    templateUrl: 'app/login/login.html',
  })
  .when('/Main', {
    templateUrl: 'app/main.html'
  })
  .when('/Profile', {
    templateUrl: 'app/profile/profile.html',
	controller: 'ProfileCtrl',
	controllerAs: 'vm'
  })
	.otherwise({
		redirectTo: '/Login'
	})
}

function communicate_setup($rootScope){
  $rootScope.$on('updatePostEmit', function(event, args){
    $rootScope.$broadcast('updatePostBroadcast', args);
  });
}

  
})()