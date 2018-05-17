(function() {

  angular.module('dummy')
    .factory('UserService', UserService)

// the UserService factory
function UserService() {
	return { 
		username: null, 
		userStatus: null,
		posts:null,
		picture:null,
		following:null,	//list of following users
		followers:[],	//followers' info, including name, status and picture
		email:null,
		zip:null
	}
}

})();