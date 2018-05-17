/**
*	This includes all information of following list
*	To be implemented...
*/

var isLoggedIn = require('./auth.js').isLoggedIn
exports.setup = function(app) {
	app.get('/following/:user*?', isLoggedIn, getFollowing)
	app.put('/following/:user', isLoggedIn, addFollowing)
	app.delete('/following/:user', isLoggedIn, removeFollowing)
}

var Profile = require('./model.js').Profile
//get the list of users being followed by the requested user
function getFollowing(req, res) {
	var sel_user
	if(!req.params.user){
		//no request user, find the following list of logged in user
		sel_user = req.username
	} else{
		sel_user = req.params.user
	}
	Profile.findOne({ username: sel_user })
	.exec(function(err, item) {
		res.send({username:sel_user, following:item.following})
	})
}

//add :user to the following list for the loggedInUser
function addFollowing(req, res){
	var newFollower = req.params.user
	var loggedInUser = req.username
	Profile.findOne({ username: newFollower })
	.exec(function(err, item) {
		Profile.findOne({ username: loggedInUser })
		.exec(function(err, profile) {
			if(item){
				//the requested user does exist on server, add it
				profile.following.push(newFollower)
				profile.save()
			}
			//send back following list of the loggedInUser
			var resFollowing = {username:loggedInUser, 
								following:profile.following}
			res.send(resFollowing)
		})
		
	})
}

//remove :user from the following list for the loggedInUser
function removeFollowing(req, res){
	var loggedInUser = req.username
	Profile.update({ username: loggedInUser },
				   {$pull: {following:req.params.user}}).exec() 
	//send back following list of the loggedInUser
	Profile.findOne({ username: loggedInUser }).exec(function(err, item){
		var resFollowing = {username:loggedInUser, 
							following:item.following}
		res.send(resFollowing)
	})
}
