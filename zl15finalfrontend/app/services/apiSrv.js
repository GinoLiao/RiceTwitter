(function() {

  angular.module('dummy')
	.constant('apiURL', 'https://zl15backend.herokuapp.com')
    //.constant('apiURL', 'http://localhost:3000')
    .factory('apiService', apiService)

function apiService($resource, apiURL, $http) {
  $http.defaults.withCredentials = true
	return $resource(apiURL + '/:endpoint/:id/:user/:users', {id:'@id', user:'@user', users:'@users' }, 
		{
			login      : { method:'POST', params: {endpoint: 'login'  } },
			logout     : { method:'PUT' , params: {endpoint: 'logout' } },
			getStatus  : { method:'GET' , params: {endpoint: 'status' } },
			getStatuses: { method:'GET' , params: {endpoint: 'statuses' } },
			setStatus  : { method:'PUT',  params: {endpoint: 'status' } },
			getPosts   : { method:'GET',  params: {endpoint: 'posts'  } },
			addPost    : { method:'POST', params: {endpoint: 'post'   } },
			editPost   : { method:'PUT',  params: {endpoint: 'posts'  } },
			getPicture : { method:'GET',  params: {endpoint: 'pictures'  } },
			setPicture : { method:'PUT', headers: { 'Content-Type': undefined },
						   transformRequest: resourceUploadFile, params: {endpoint: 'picture' } },
			upload	   : { method:'POST', headers: { 'Content-Type': undefined },
						   transformRequest: resourceUploadFile, params: {endpoint: 'post' } },
			loadFollowings:{method:'GET' , params: {endpoint: 'following' } },
			addFollowing: { method:'PUT',  params: {endpoint: 'following' } },
			removeFollowing: { method:'DELETE',  params: {endpoint: 'following' } },
			getEmail   : { method:'GET' , params: {endpoint: 'email' } },
			setEmail   : { method:'PUT',  params: {endpoint: 'email' } },
			getZip     : { method:'GET' , params: {endpoint: 'zipcode' } },
			setZip     : { method:'PUT',  params: {endpoint: 'zipcode' } },
			setPassword: { method:'PUT',  params: {endpoint: 'password' } },
			register   : { method:'POST', params: {endpoint: 'register' } },
			unlinkAcc  : { method:'GET', params: {endpoint: 'unlink' } },
			linkAcc  : { method:'POST', params: {endpoint: 'linkaccount' } },
		})
}

function resourceUploadFile(data) {
     var fd = new FormData()  
     fd.append('image', data.img)
     fd.append('body', data.body)
     return fd;
}

})();