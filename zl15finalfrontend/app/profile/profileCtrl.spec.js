/***************************
 * Test suite for profileCtrl.js *
 ***************************/
describe('Profile Controller Tests', function() {
	var helper = jasmine.helper
	var ctrl;
	var promises = []

	beforeEach(module('dummy'))	

	beforeEach(module(function($provide) {
		$provide.value('apiService', helper.mockApiService)
	}))

	beforeEach(inject(function($controller, $rootScope, $q, apiService, UserService) {		
		helper.init($q)
 		ctrl = $controller('ProfileCtrl', {
			'apiService': apiService,
			'UserService': UserService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()
	}))

	
	it('should get email address for the requested user', function() {
		ctrl.username = "zl15test"
		ctrl.getEmail()
		ctrl._resolveTestPromises()
		expect(ctrl.email).toEqual("zl15test@rice.edu")
	})

	it('should get zip code', function() {
		ctrl.username = "zl15test"
		ctrl.getZip()
		ctrl._resolveTestPromises()
		expect(ctrl.zip).toEqual("77005")
	})

	it('should set to a new Email address', function() {
		var newEmail = "qwerty@rice.edu"
		ctrl.newEmailInput = newEmail
		ctrl.setEmail()
		ctrl._resolveTestPromises()
		expect(ctrl.email).toEqual(newEmail)
	})
	
	it('should set to a new zip code', function() {
		var newZip = "11111"
		ctrl.newZipInput = newZip
		ctrl.setZip()
		ctrl._resolveTestPromises()
		expect(ctrl.zip).toEqual(newZip)
	})
	
	
	
})
