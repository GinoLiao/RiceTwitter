/***************************
 * Test suite for postsCtrl.js *
 ***************************/
describe('Posts Controller Tests', function() {
	var helper = jasmine.helper
	var ctrl;
	var promises = []

	beforeEach(module('dummy'))	

	beforeEach(module(function($provide) {
		$provide.value('apiService', helper.mockApiService)
	}))

	beforeEach(inject(function($controller, $rootScope, $q, apiService, UserService) {		
		helper.init($q)
 		ctrl = $controller('postsCtrl', {
			'apiService': apiService,
			'UserService': UserService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()
	}))

	
	it('should call the post api and get 2 Test posts', function() {
		ctrl.loadPosts()
		ctrl._resolveTestPromises()
		expect(ctrl.posts.length).toBe(2)
		expect(ctrl.posts[0].author).toEqual('Test')
		expect(ctrl.posts[1].author).toEqual('Test2')
	})

	it('should add a new post', function() {
		var newTestPostBody = "new test post body"
		ctrl.addPost(newTestPostBody)
		ctrl._resolveTestPromises()
		expect(ctrl.posts.length).toBe(3)
		expect(ctrl.posts[2].body).toEqual(newTestPostBody)
	})

	it('should edit a post', function() {
		var newEditPostInput = "edit test post input body"
		expect(ctrl.posts[0].body).not.toEqual(newEditPostInput)
		ctrl.editPost(newEditPostInput, 1)
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].body).toEqual(newEditPostInput)
	})
	
	it('should add a comment to a post', function() {
		expect(ctrl.posts[0].comments.length).toBe(1)
		var newCommentInput = "new comment input body"
		ctrl.editPost(newCommentInput, 1, -1)
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].comments.length).toBe(2)
		expect(ctrl.posts[0].comments[1].body).toEqual(newCommentInput)
	})
	
	it('should edit a comment of a post', function() {
		var newEditCommentInput = "edit comment input body"
		
		ctrl.editPost(newEditCommentInput, 2, 1)
		ctrl._resolveTestPromises()
		
		expect(ctrl.posts[1].comments[0].body).toEqual(newEditCommentInput)
	})
	
})
