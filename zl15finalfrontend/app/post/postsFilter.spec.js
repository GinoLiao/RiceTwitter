/***************************
 * Test suite for postsFilter.js *
 ***************************/
describe('Posts Filter Tests', function() {
	var helper = jasmine.helper
	var ctrl;
	var filter;
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
	
	beforeEach(inject(function($injector){
		filter = $injector.get('$filter')('filterNamePostText');
	}))

	
	it('should filter by author', function() {
		console.log(ctrl.posts)
		filter(ctrl.posts, "Test2")
		expect(ctrl.posts.length).toBe(1)
	})
	
})