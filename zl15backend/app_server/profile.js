/**
*	This includes all information of user profile
*	
*/
var isLoggedIn = require('./auth.js').isLoggedIn
var multer = require('./cloudinary.js').multer
var stream = require('./cloudinary.js').stream
var cloudinary = require('./cloudinary.js').cloudinary
var uploadImage = require('./cloudinary.js').uploadImage
exports.setup = function(app) {
	app.get('/status', isLoggedIn, getStatus)
	app.put('/status', isLoggedIn, updateStatus)
	app.get('/statuses/:users*?', isLoggedIn, getStatuses)
	app.get('/email/:user*?', isLoggedIn, getEmail)
	app.put('/email', isLoggedIn, updateEmail)
	app.get('/zipcode/:user*?', isLoggedIn, getZip)
	app.put('/zipcode', isLoggedIn, updateZip)
	app.get('/pictures/:user*?', isLoggedIn, getPictures)
	app.put('/picture', isLoggedIn, uploadImage, updatePictures)
}

var LoggedInUser = "zl15test"
var Profile = require('./model.js').Profile
//Get the status for the loggedInUser
var serverStatuses = { statuses: [{username:LoggedInUser, status:'Happy'}]}
function getStatus(req, res){
	Profile.findOne({ username: req.username }).exec(function(err, item) {
		res.send({statuses: [{username:req.username, status:item.status}]})
	})
}

//Update the status for the loggedInUser
function updateStatus(req, res){
	//update
	Profile.update({username: req.username},
				   {$set:{status: req.body.status }}).exec()
	//send back modified status
	Profile.findOne({ username: req.username }).exec(function(err, item) {
		var resStatus = {username:req.username, status:item.status}
		res.send(resStatus)
	})
}

function getStatuses(req, res){
	if(!req.params.users){
		Profile.findOne({username:req.username})
			.exec(function(err,item) {
			//send logged in user's status
			var resStatus = {statuses:[
				{username: item.username, status: item.status}]}
			return res.send(resStatus)
		})
	}
	else{//send statuses of requested users
		var userlist = req.params.users.split(",")
		Profile.find({ username: { $in: userlist } })
		.exec(function(err, items) {
			var selectedStatuses = []
			items.forEach(function(profile){
				selectedStatuses.push({username: profile.username,
										status: profile.status});
			})
			res.send({statuses:selectedStatuses})
		})
	}
}

function getEmail(req, res){
	var sel_user
	if(!req.params.user){//logged in user
		sel_user = req.username
	} else{//requested user
		sel_user = req.params.user
	}
	Profile.findOne({ username: sel_user }).exec(function(err, item) {
		res.send({username:sel_user, email:item.email})
	})
}

function updateEmail(req, res){
	//set to new email
	Profile.update({username: req.username},
				   {$set:{email: req.body.email }}).exec()
	//send back modified status
	Profile.findOne({ username: req.username }).exec(function(err, item) {
		res.send({username:req.username, email:item.email})
	})	
}

function getZip(req, res){
	var sel_user
	if(!req.params.user){//logged in user
		sel_user = req.username
	} else{//requested user
		sel_user = req.params.user
	}
	Profile.findOne({ username: sel_user }).exec(function(err, item) {
		res.send({username:sel_user, zipcode:item.zipcode})
	})
}

function updateZip(req, res){
	Profile.update({username: req.username},
				   {$set:{zipcode: req.body.zipcode }}).exec()
	//send back modified status
	Profile.findOne({ username: req.username }).exec(function(err, item){
		res.send({username:req.username, zipcode:item.zipcode})
	})	
}

function getPictures(req, res){
	if(!req.params.user){
		Profile.findOne({username: req.username})
		.exec(function(err,item) {
			var resPic = {pictures:[
				{username: item.username, picture: item.picture}]}
			// send loggedin user's pictures
			return res.send(resPic)
		})
	}
	else{//send requested users' pictures
		var userlist = req.params.user.split(",")
		Profile.find({ username: { $in: userlist } })
		.exec(function(err, items) {
			var selectedPics = []
			items.forEach(function(profile){
				selectedPics.push({username: profile.username,
									picture: profile.picture});
			})
			res.send({pictures:selectedPics})
		})
	}
}

function updatePictures(req, res){
	// body-parser provides us the textual formData
	// which is just title in this case
	var publicName = req.body.title
	var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
		// create an image tag from the cloudinary upload
		var image = cloudinary.image(result.public_id, {
			format: "png", width: 100, height: 130, crop: "fill" 
		})
		//update to the user's profile and send back the profile picture
		Profile.findOne({username: req.username})
		.exec(function(err,item) {
			item.picture = result.url
			item.save()
			// send loggedin user's pictures
			var resPic = { username: req.username , picture: item.picture }
			res.send(resPic)	
		})
		
	}, { public_id: publicName })

	var s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)
	// and the end of the buffer we tell cloudinary to end the upload.
}