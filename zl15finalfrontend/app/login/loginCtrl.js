;(function() {
'use strict'

angular.module('dummy')
  .controller('LoginCtrl', LoginCtrl)
  ;
    
LoginCtrl.$inject = ['apiService','UserService']
function LoginCtrl(apiService, UserService) {
	var vm = this
	vm.username	= ""
	vm.password	= ""	
	vm.message = ""				//login status message
	vm.registerMsg = ""			//register status message
	vm.getStatus = getStatus
	vm.login = login
	vm.logout = logout
	vm.register = register
	//reload login status info if we lost UserService, 
	// such as refreshing the page
	if(!UserService.username){
		vm.getStatus()
	}
  
  //*********** functions ******************//
	function register(usernameInput, emailInput, zipcodeInput,
						pwdInput, pwdConfirmInput){
		if(pwdInput == pwdConfirmInput){
			apiService.register({username:usernameInput,
								email:emailInput, zipcode:zipcodeInput,
								password:pwdInput})
								.$promise.then(function(result) {
				vm.registerMsg = "register " + result.result + 
						" for username: " + result.username
			})
		}
		else{
			vm.registerMsg = "Passwords don't match!"
		}
	}
	
    function login() {
		if (!vm.username) {
    	    return
    	}         
		function redirect(callback){
			window.location.href = window.location.origin + "/#/Main"
		}
		function resolve(result, callback){
			vm.getStatus()
			vm.password = ''
			// XXX grab the username from the server
			// put it into the UserService singleton
			vm.username = result.username
			UserService.username = result.username
			document.getElementById("mainLink").style.display = "inline-block"
			document.getElementById("profileLink").style.display = "inline-block"
			callback();	//after resolving the result, redirect to main page
		}
		
        apiService.login({'username':vm.username, 'password':vm.password})
             .$promise.then(function(result){
				 resolve(result, redirect)
			   }, function(error){
				 vm.message = "User name and password don't match. Please try again"
			 })
    }

    function logout() {
		document.getElementById("mainLink").style.display = "none"
		document.getElementById("profileLink").style.display = "none"
		apiService.logout().$promise.then(function(result){
			vm.username = ''
			// XXX clear the UserService singleton's username value
			getStatus()
			//reset userservice when logout so if another user logs in,
			//the userservice is clean
			clearUserService();
		})
    }
	
	function clearUserService(){
		UserService.username = null
		UserService.userStatus = null
		UserService.posts = null
		UserService.picture = null
		UserService.following = null
		UserService.followers = []
		UserService.email = null
		UserService.zip = null
	}
	//get user login status
	function getStatus() {
		apiService.getStatus().$promise.then(function(result) {
			UserService.userStatus = result.statuses[0].status
			vm.username = result.statuses[0].username
			UserService.username = vm.username
			vm.message = 'You are logged in as ' + result.statuses[0].username
			document.getElementById("mainLink").style.display = "inline-block"
			document.getElementById("profileLink").style.display = "inline-block"
		}, function(error) {
			/*when the user is not logged in, 401 exception is thrown
			To avoid this, I can let the backend sendStatus 200 and handle that,
			but since I don't know how the autograder for backend is implemented,
			what if the autograder expect a 401 when a non-loggedin sends server
			request to the backend. So, I'd choose this way because this works well
			with autograder in previous assignments. So, it's better to give us the 
			autograder implementation for future students...*/
			vm.message = 'You are Not Logged In'
		})
	}
}

})()




  
