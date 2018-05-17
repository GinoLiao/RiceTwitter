//right now only takes picture from userservice
angular.module('dummy')
	.controller('ProfileCtrl', ProfileCtrl)


ProfileCtrl.$inject = ['apiService','UserService']
function ProfileCtrl(apiService, UserService){
	var vm = this
	vm.username = UserService.username
	vm.picture = UserService.picture
	vm.message = ''
	vm.email = UserService.email
	vm.zip = UserService.zip
	vm.getEmail = getEmail
	vm.getZip = getZip
	vm.getPicture = getPicture
	vm.setPicture = setPicture
	vm.setFile = setFile
	vm.setEmail = setEmail
	vm.setZip = setZip
	vm.setPassword = setPassword
	//for linking and unlinking accounts
	vm.unlinkMsg = ''
	vm.linkMsg = ''
	vm.linkusername = ''
	vm.linkpassword = ''
	vm.linkAccountDisplay = linkAccountDisplay
	vm.linkAccount = linkAccount
	vm.unlinkAccount = unlinkAccount
	
	//reload info if we lost UserService when refreshing the page
	if(!UserService.email){
		vm.getEmail()
	}
	if(!UserService.zip){
		vm.getZip()
	}
	if(!UserService.picture){
		 vm.getPicture();
	}
	if(vm.username){//if user logged in, show link account button
		showLinkBtn(vm.username)
	}else{	//empty username , get username and then show link btn
		getEmail(showLinkBtn);	
	}
	
	//general functions
	// shows link or unlink buttons
	function showLinkBtn(username){
		if(username.endsWith('@face')){//loggedin with facebook
			document.getElementById("linkAccBtn").style.display = "inline-block"
		}else{//normal login
			document.getElementById("unlinkAccDiv").style.display = "inline-block"
		}
	}
	
	//get email and username
	function getEmail(callback){
		apiService.getEmail({user:vm.username}).$promise.then(function(result){
			vm.username = result.username
			UserService.username = vm.username
			vm.email = result.email
			UserService.email = vm.email
			if(callback){
				callback(result.username);
			}
		}, function(error) {
			//user is not logged in, cannot navigate to Main or Profile page
			window.location.href = window.location.origin + "/#/Login"
		})
		
	}
	
	//get zipcode of loggedin user
	function getZip(){
		apiService.getZip({user:vm.username})
		.$promise.then(function(result) {
			vm.zip = result.zipcode
			UserService.zip = vm.zip
		})
	}
	
	//get user's profile picture and save the pic to 
	//userservice to share btw controllers
	function getPicture() {
		apiService.getPicture().$promise.
		then(function(result) {
			vm.picture = result.pictures[0].picture
			UserService.picture = vm.picture
		})
	}
	
	function setEmail(){
		apiService.setEmail({email:vm.newEmailInput}).$promise.then(function(result) {
			vm.email = result.email
			UserService.email = result.email
		})
	}
	
	function setZip(){
		apiService.setZip({zipcode:vm.newZipInput}).$promise.then(function(result) {
			vm.zip = result.zipcode
			UserService.zip = result.zipcode
		})
	}
	
	function setPassword(pwd, pwdConfirm){
		if((!pwd) && pwdConfirm){	
			vm.message = "Please fill in password"
		}
		else if(pwd && (!pwdConfirm)){
			vm.message = "Please confirm your password"
		}
		else if(pwd && pwdConfirm){
			if(pwd != pwdConfirm){
				vm.message = "Passwords don't match"
			}
			else{//passwords validate and set to new one
				apiService.setPassword({password:pwd}).$promise.then(function(result) {
					vm.message = result.status
				})
			}
		}
	}
	
	//set profile picture for loggedin user
	function setPicture(){
		apiService.setPicture({img:vm.newImage}).$promise.then(function(result) {
			vm.picture = result.picture
			UserService.picture = result.picture
		})
	}
	
	function setFile(element){
		vm.newImage = element.files[0]
	}
	
	//link site acccount with facebook account
	function linkAccount(){
		apiService.linkAcc({username:vm.linkusername, 
							password:vm.linkpassword})
		.$promise.then(function(result) {
			vm.linkMsg = 'You are now linked '+ vm.username +'with  ' + result.username
			location.reload();
		}, function(error){
			vm.linkMsg = 'Linking Account failed. Check your username and password input'
		})
	}
	
	//unlink site  account with already linked facebook account
	function unlinkAccount(){
		apiService.unlinkAcc().$promise.then(function(result) {
			if(result.message=='success'){
				vm.unlinkMsg = 'You unlinked with ' + result.faceAccount
			}
			else{
				vm.unlinkMsg = 'You are not linked with any Facebook account.'
			}
		})
	}
	
	//shows the link account input fields
	function linkAccountDisplay(){
		document.getElementById("linkAccDiv").style.display = "inline-block"
	}
	
	
}
	