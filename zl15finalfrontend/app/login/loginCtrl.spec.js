/***************************
 * Test suite for loginCtrl.js *
 ***************************/
describe('Login Controller Tests', function() {
	var helper = jasmine.helper
	var ctrl;
	var promises = []

	beforeEach(module('dummy'))	

	beforeEach(module(function($provide) {
		$provide.value('apiService', helper.mockApiService)
	}))

	beforeEach(inject(function($controller, $rootScope, $q, apiService, UserService) {		
		helper.init($q)
 		ctrl = $controller('LoginCtrl', {
			'apiService': apiService,
			'UserService': UserService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()
	}))

	it('should not log in an invalid user', function() {
		ctrl.username = "zl15test"
		ctrl.password = "password"
		ctrl.login()
		ctrl._resolveTestPromises()
		expect(ctrl.loggedIn).not.toEqual(false)
	})
	
	it('should log in a valid user', function() {
		ctrl.username = "zl15test"
		ctrl.password = "at-repeat-ask"
		ctrl.login()
		ctrl._resolveTestPromises()
		expect(ctrl.loggedIn).toBe(true)
	})


	it('should log out', function() {
		ctrl.logout()
		ctrl._resolveTestPromises()
		expect(ctrl.loggedIn).toEqual(false)
	})
	
	it('should share the username between controllers', inject(function($controller, UserService) {
		
		var testCtrl = $controller('TestCtrl', { UserService })
		expect(ctrl.getUsername()).toBe(testCtrl.getUsername()) // uncomment this statement
		
	}))
	
})
