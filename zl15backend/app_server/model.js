// this is model.js 
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	//commentId = hash of the author & timestamp 
	commentId: String, author: String, date: Date, body: String
})
var postSchema = new mongoose.Schema({
	id: String, author: String, img: String, date: Date, body: String,
	comments: [ commentSchema ]
})

//facebook username is put in 'auth' field if two accounts link
var userSchema = new mongoose.Schema({
	username: String, salt: String, hash: String, auth: String	
})

var profileSchema = new mongoose.Schema({
	username: String, 
	status: String,
    following: [ String ],
    email: String,
    zipcode: String,
    picture: String
})

exports.Post = mongoose.model('post', postSchema)
exports.User = mongoose.model('user', userSchema)
exports.Profile = mongoose.model('profile', profileSchema)