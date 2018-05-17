/**
*	end-to-end test 
**/
describe('frontend End to End Exercise', function() {
	'use strict'

	beforeEach(function() {
		browser.get('/index.html')
	})

	it('should register a new user', function() {		
		register()
		expect(element(by.id('registerMsg')).getText()).toMatch("register success for username: testusername")		
	})

	//fill in register info and click "register" button
	function register(){
		element(by.id('accname')).sendKeys('testusername')
		element(by.id('emailaddr')).sendKeys('test@rice.edu')
		element(by.id('phonenum')).sendKeys('1234567890')
		element(by.id('birthday')).sendKeys('05282011')
		element(by.id('zip')).sendKeys('12345')
		element(by.id('pwd')).sendKeys('abcde')
		element(by.id('pwdConfirm')).sendKeys('abcde')
		element(by.id('registerBtn')).click()
	}
	

	it('should log in as my test user and validate my status message', function() {	
		// check website
		expect(element(by.id('loginMsg')).getText()).toMatch("You are Not Logged In")
		// browser.pause();
		login()
		// after logging in, link to main page is displayed
		expect(element(by.id("mainLink")).isDisplayed()).toBe(true)
		//redirect to login page and validate the login message
		element(by.id('loginLink')).click()
		expect(element(by.id('loginMsg')).getText()).toMatch("You are logged in as zl15test")
		// expect(element.all(by.css('.message')).first().getText()).toMatch("You are now logged in!")
		logout()
	})
	
	
	function login() {
		// log in by sending username and password for your test account and click "login"
		element(by.id('accNameLogin')).sendKeys('zl15test')
		element(by.id('pwdLogin')).sendKeys('at-repeat-ask')
		element(by.id('loginBtn')).click()
	}

	function logout() {
		// click the logout button
		element(by.id('globalLogout')).click()
		// grab the current "message" and validate it is "You are Not Logged In"
		expect(element(by.id('loginMsg')).getText()).toMatch("You are Not Logged In")
	}
	
	
	it('should create a new post and validate the post appears in the feed', function() {
		login()
		element(by.id("mainLink")).click()		
		createPost()
		expect(element.all(by.id('postBody')).first().getText()).toMatch("test new post")
		logout()
	})
	
	function createPost(){
		element(by.id("newPostBody")).sendKeys("test new post")
		element(by.id("newPostBtn")).click()
	}
	
	it('should update the status headline and verify the change', function() {
		login()
		element(by.id("mainLink")).click()
		//set to a random one to verify the change, might be the same as before
		//, so set twice to make sure it changes
		setStatus("new Status")
		expect(element(by.id("headline")).getText()).toMatch("new Status")
		//set to another one to verify the change
		setStatus("another Status")
		expect(element(by.id("headline")).getText()).toMatch("another Status")
		logout()
	})
	
	function setStatus(value) {
		element(by.id('headlineInput')).clear()
		element(by.id('headlineInput')).sendKeys(value)
		element(by.id('updateStatusBtn')).click()		
	}
	
	
	it('should add the user "Follower" to the list of followed users and verify the count increases by one', function() {
		login()
		element(by.id("mainLink")).click()
		element.all(by.repeater("follower in vm.followers")).count().then(function(count) {//count is the current number of followers
			//add the user "Follower"
			/* This won't pass if "Follower" is already in the list, because my add new user to following list function 
				prevents the user from adding an existing follower. So, just remove "Follower" if it is in the following list*/
			removeFollower()
			element(by.id("newFollowerInput")).sendKeys("Follower")
			element(by.id("addFollowerBtn")).click()
			//verify the count increases by one
			expect(element.all(by.repeater("follower in vm.followers")).count()).toBe(count+1)
		});		
		logout()
	})
	
	//removes "Follower if it's in the list"
	function removeFollower(){
		//one follower name comes with an unfollow button
		element.all(by.id("folowerName")).each(function(element, index){
			element.getText().then(function(text){
				if(text == "Follower"){
					element.all(by.id("unfollowBtn")).get(index).click()
				}
			})
		})
	}
	
	
	it('should remove the user "Follower" from the list of followed users and verify the count decreases by one', function() {
		login()
		element(by.id("mainLink")).click()
		element.all(by.repeater("follower in vm.followers")).count().then(function(count) {//count is the current number of followers
			//one follower name comes with an unfollow button
			element.all(by.id("folowerName")).each(function(element, index){
				element.getText().then(function(text){
					if(text == "Follower"){
						element.all(by.id("unfollowBtn")).get(index).click()
						expect(element.all(by.repeater("follower in vm.followers")).count()).toBe(count-1)
					}
				})
			})
		})		
		logout()
	})
	
	it('should search for "Only One Post Like This" and verify only one post shows, and verify the author', function() {
		login()
		element(by.id("mainLink")).click()
		element(by.id("search")).sendKeys("Only One Post Like This")
		expect(element.all(by.css(".post")).count()).toBe(1)
		//currently the author is "zl15test" if I log in as "zl15test"
		expect(element(by.css(".postAuthor")).getText()).toMatch("zl15test")	
		logout()
	})
	
	
	it('should update the user\'s email and verify', function() {
		login()
		element(by.id("profileLink")).click()
		//might be same as before, so set twice to ensure the change
		setEmail("testEmail@rice.edu")	
		expect(element(by.id("emailAddr")).getText()).toMatch("testEmail@rice.edu")
		
		setEmail("zl15test@rice.edu")
		expect(element(by.id("emailAddr")).getText()).toMatch("zl15test@rice.edu")
		logout()
	})
	
	function setEmail(newEmail){
		element(by.id('emailAddrInput')).clear()
		element(by.id("emailAddrInput")).sendKeys(newEmail)
		element(by.id("updateEmailBtn")).click()
	}
	
	it('should update the user\'s zipcode and verify', function() {
		login()
		element(by.id("profileLink")).click()
		//might be same as before, so set twice to ensure the change
		setZip("77777")
		expect(element(by.id("zip")).getText()).toMatch("77777")
		
		setZip("77005")
		expect(element(by.id("zip")).getText()).toMatch("77005")
		logout()
	})
	
	function setZip(newZip){
		element(by.id('zipInput')).clear()
		element(by.id("zipInput")).sendKeys(newZip)
		element(by.id("updateZipBtn")).click()
	}
	
	it('should update the user\'s password, verify a "will not change" message is returned', function() {
		login()
		element(by.id("profileLink")).click()
		setPassword("1234567")
		expect(element(by.id("updateProfileMsg")).getText()).toMatch("will not change")
		logout()
	})
	
	function setPassword(pwd){
		element(by.id("pwdInput")).sendKeys(pwd)
		element(by.id("pwdConfirmInput")).sendKeys(pwd)
		element(by.id("updatePwdBtn")).click()
	}
	
})
