
angular.module('dummy')
	.controller('postsCtrl', postsCtrl)
	;

postsCtrl.$inject = ['$scope', 'apiService', 'UserService']
function postsCtrl($scope, apiService, UserService){
	var vm = this
	vm.posts = UserService.posts	//load posts from userservice
	vm.addPost = addPost
	vm.editPost = editPost
	vm.searchPosts = ''
	vm.setFile = setFile
	vm.loadPosts = loadPosts
	vm.showEditPost = showEditPost
	vm.showEditComment = showEditComment
	//reload posts if we lost UserService, such as refresing the page
	if(!UserService.posts){
		vm.loadPosts();
	}

	//invoked by followingCtrl to update posts after following/unfollowing a user
	$scope.$on('updatePostBroadcast', function(event, args){
		vm.loadPosts();
	});
	
	//show edit post button and input field
	function showEditPost(postid){
		if(document.getElementById("editPostDiv" + postid).style.display == "none"){
			document.getElementById("editPostDiv" + postid).style.display = "block"
			document.getElementById("showEditPostBtn" + postid).innerHTML = "Cancel"
		} else {
			document.getElementById("editPostDiv" + postid).style.display = "none"
			document.getElementById("showEditPostBtn" + postid).innerHTML = "Edit Post"
		}
	}
	//show edit comment button and input field
	function showEditComment(commentId){
		if(document.getElementById("editCommentP" + commentId).style.display == "none"){
			document.getElementById("editCommentP" + commentId).style.display = "block"
			document.getElementById("showEditCommentBtn" + commentId).innerHTML = "Cancel"
		} else {
			document.getElementById("editCommentP" + commentId).style.display = "none"
			document.getElementById("showEditCommentBtn" + commentId).innerHTML = "Edit Comment"
		}
	}
	
	//load posts from server and save to UserService
	function loadPosts() {
		vm.posts = []
		apiService.getPosts().$promise.then(function(result) {
			result.posts.forEach(function(post) {
				vm.posts.push(post)
			})
		})
		UserService.posts = vm.posts
	}
	
	function addPost(newPostBody){
		if(vm.newImage){//with img add post	//will use in next hw
			apiService.upload({'body':newPostBody, 'img':vm.newImage})
				.$promise.then(function(result) {
					vm.posts.push(result.posts[0])
			})
		}
		else{//without img
			apiService.addPost({'body':newPostBody})
				.$promise.then(function(result) {
					vm.posts.push(result.posts[0])
			})
		}
		UserService.posts = vm.posts
	}
	
	//edit post, add comment, edit comment
	function editPost(newPostInput, postId, commentId){
		apiService.editPost({id:postId}, {'body':newPostInput, 
										'commentId':commentId})
		.$promise.then(function(result) {
			vm.posts.forEach(function(post, index){
				if(post.id == postId){
					vm.posts[index] = result.posts[0]
					UserService.posts = vm.posts
				}
			})
		}, function(error){
			//403 forbiden when post body cannot be edited by this user, so just hide the edit division
			vm.showEditPost(postId)
		})
	}

	function setFile(element){
		vm.newImage = element.files[0]
	}
}
