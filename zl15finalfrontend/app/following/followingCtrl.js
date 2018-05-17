;(function() {
'use strict'

angular.module('dummy')
	.controller('followingCtrl', followingCtrl)
	
followingCtrl.$inject = ['$scope', 'apiService', 'UserService']
function followingCtrl($scope, apiService, UserService){
	var vm = this
	vm.message = ''	//shows message of adding errors
	//list of followers' names
	vm.followersNameList = UserService.following
	//list of followers with their info: name, status, img(shown in html)
	vm.followers = UserService.followers	
	vm.addFollowing = addFollowing
	vm.removeFollowing = removeFollowing
	vm.loadFollowings = loadFollowings
	vm.loadPosts = loadPosts

	if(!UserService.following){
		vm.loadFollowings();
	}
	
	
	//call loadPost in postCtrl to update posts after following/unfollowing a user
	function loadPosts(){
		$scope.$emit('updatePostEmit', {});
	}

	function loadFollowings(){
		apiService.loadFollowings().$promise.then(function(result) {
			vm.followersNameList = result.following
			vm.followers = []	//clear userservice before loading
			/*get statuses and imgs. In this way, they are sorted in the same order as follower names list.
				For example, index 1 of UserService.followingInfo.followers  is 'zl15'
					then index 1 of    UserService.followingInfo.statuses & UserService.followingInfo.pictures
					are 'zl15'\'s status and img
			*/
			//empty following list, no need to load followings
			if(result.following.length == 0){ 
				return 
			}
			//load info of followers
			result.following.forEach(function(follower){
				vm.followers.push({name:follower})
			})
			apiService.getStatuses({users:result.following})
			.$promise.then(function(result) {
				result.statuses.forEach(function(userStatus,index){
					vm.followers[index].status = userStatus.status
				})
			})
			apiService.getPicture({user:result.following})
			.$promise.then(function(result) {
				result.pictures.forEach(function(userPic,index){
					vm.followers[index].img = userPic.picture
				})
			})
			UserService.following = vm.followersNameList
			UserService.followers = vm.followers
		})
	}
	
	function addFollowing(follower){
		if(vm.followersNameList.indexOf(follower) < 0){	
			//if the follower is not is the following list
			apiService.addFollowing({user:follower})
				.$promise.then(function(result) {
				if(result.following.length > vm.followersNameList.length){
					//added user successfully
					var newAddedFollower = {}
					//the last one is the new added follower 
					//based on current server response
					newAddedFollower.name = 
							result.following[result.following.length-1]
					apiService.getStatuses({users:newAddedFollower.name})
					.$promise.then(function(result) {
						newAddedFollower.status = result.statuses[0].status
					})
					apiService.getPicture({user:newAddedFollower.name})
					.$promise.then(function(result) {
						newAddedFollower.img = result.pictures[0].picture
					})
					vm.followers.push(newAddedFollower)
					//update UserService
					UserService.followers = vm.followers
					//update vm.followersNameList for later 
					//determining whether this username input
					//is already in following list
					vm.followersNameList.push(newAddedFollower.name)
					UserService.following = vm.followersNameList
					vm.loadPosts();
				}
				else{
					vm.message = "User name doesn't exist on server!"
				}
			})
		}
		else{
			vm.message = "User exists in following list"
		}
	}	
	
	function removeFollowing(follower){
		//record index for later removing
		var removeIndex = vm.followersNameList.indexOf(follower)	
		apiService.removeFollowing({user:follower})
		.$promise.then(function(result) {
				vm.followers.splice(removeIndex, 1)
				vm.followersNameList.splice(removeIndex, 1)
				vm.loadPosts();
			})
	}
}
	
})()