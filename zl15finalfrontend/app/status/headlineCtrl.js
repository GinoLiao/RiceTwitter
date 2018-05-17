//headline status controller

angular.module('dummy')
	.controller('headlineCtrl', headlineCtrl)
	;
	
headlineCtrl.$inject = ['apiService', 'UserService']
function headlineCtrl(apiService, UserService){
	var vm = this
	vm.setStatus = setStatus
	//load from user service
	vm.picture = UserService.picture
	vm.headlineStatus = UserService.userStatus
	vm.username = UserService.username
	vm.getPicture = getPicture
	vm.getStatus = getStatus
	//reload if we lost UserService, such as refreshing the page
	if(!UserService.picture){
		 vm.getPicture();
	}
	if((!UserService.username) || (!UserService.userStatus)){
		vm.getStatus();
	}
	
	/**functions for headline status **/
	//get user's profile picture and save the pic to 
	//userservice to share btw controllers
	function getPicture() {
		apiService.getPicture().$promise.
		then(function(result) {
			vm.picture = result.pictures[0].picture
			UserService.picture = vm.picture
		})
	}
	
	//get user's status and username
	function getStatus() {
		apiService.getStatus().$promise.then(function(result) {
			vm.username = result.statuses[0].username
			UserService.username = vm.username
			vm.headlineStatus = result.statuses[0].status
			UserService.userStatus = vm.headlineStatus
		}, function(error) {
			//user is not logged in, cannot navigate to Main or Profile page
			window.location.href = window.location.origin + "/#/Login"
		})
	}
	
	//update user's status
	function setStatus(newStatus) {
		apiService.setStatus({ status: newStatus}).$promise.
		then(function(result) {
			vm.headlineStatus = result.status
			UserService.userStatus = vm.headlineStatus
		})
	}
}
