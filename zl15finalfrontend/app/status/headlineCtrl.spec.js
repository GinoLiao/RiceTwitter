/***************************
 * Test suite for headlineCtrl.js *
 ***************************/
describe('Headline status Controller Tests', function() {
	var helper = jasmine.helper
	var ctrl;
	var promises = []

	beforeEach(module('dummy'))	

	beforeEach(module(function($provide) {
		$provide.value('apiService', helper.mockApiService)
	}))

	beforeEach(inject(function($controller, $rootScope, $q, apiService, UserService) {		
		helper.init($q)
		console.log('here', apiService)
 		ctrl = $controller('headlineCtrl', {
			'apiService': apiService,
			'UserService': UserService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()
	}))

	it('should update status headline and userservice is also updated to share betweeen controllers'
		,inject(function(UserService) {
		var newTestStatus = "New Test Status"
		ctrl.setStatus(newTestStatus)
		ctrl._resolveTestPromises()
		expect(ctrl.headlineStatus).toEqual(newTestStatus)
		expect(UserService.userStatus).toEqual(newTestStatus)
	}))

	
})
