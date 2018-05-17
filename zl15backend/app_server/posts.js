/**
*	This includes all information of posts
*/
var isLoggedIn = require('./auth.js').isLoggedIn
var multer = require('./cloudinary.js').multer
var stream = require('./cloudinary.js').stream
var cloudinary = require('./cloudinary.js').cloudinary
var uploadImage = require('./cloudinary.js').uploadImage
exports.setup = function(app){
	app.get('/posts/:id*?', isLoggedIn, getPosts)
	app.post('/post', isLoggedIn, uploadImage, addPost)
	app.put('/posts/:id', isLoggedIn, updatePost)
}

var Post = require('./model.js').Post
var Profile = require('./model.js').Profile
var md5 = require('md5')

/**
*	A requested post, all requested posts by a user, or 
*	array of posts in the loggedInUser's feed
**/
function getPosts(req, res){
	var idlist = req.params.id
	if(!idlist){
		Profile.findOne({username: req.username})
		.exec(function(err, profile) {
			//a list of users including itself and users in the following list
			var usersToQuery = [ req.username ]
			var usersToQuery = usersToQuery.concat(profile.following)
			//get 10 latest posts from users in the list usersToQuery
			Post.find({author:{$in:usersToQuery}})
			.sort({date: -1}).limit(10)
			.exec(function(err,items){
				var resPosts = {posts:[]}
				items.forEach(function(post){
					resPosts.posts.push({id: post.id, author: post.author,
								img: post.img, date: post.date,
								body: post.body, comments: post.comments});
				})
				res.send(resPosts)
			})
		})
	}
	else{//get a list of posts in the requested idlist
		Post.find({ id: { $in: idlist.split(",") } }).exec(function(err, items) {
			var resPosts = {posts:[]}
			items.forEach(function(post){
				resPosts.posts.push({id: post.id, author: post.author,
							img: post.img, date: post.date,
							body: post.body, comments: post.comments});
			})
			if(resPosts.posts.length > 0){
				res.send(resPosts)
			}
			else{//send nothing with invalid requested id
				res.send()
			}
		})
	}
}

/**
*	Add a new post for the loggedInUser, date and id are 
*	determined by server. Optional image upload
**/
function addPost(req, res){
	var timeNow = new Date().getTime()
	var author = req.username
	if(req.file){	//post with picture uploaded
		var publicName = author + timeNow
		var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
			// create an image tag from the cloudinary upload
			var image = cloudinary.image(result.public_id, {
				format: "png", width: 100, height: 130, crop: "fill" 
			})
			//add new post with picture
			new Post({ id: md5(timeNow+author), author: author, img: result.url, 
				date: timeNow, body: req.body.body,
				comments:[]}).save(function(){
				//send back the latest added post
				Post.findOne().sort({date: -1}).exec(function(err,newPost){
					var resPosts = {posts:[{ id: newPost.id, author: newPost.author,
						img: newPost.img, date: newPost.date, 
						body: newPost.body, comments: newPost.comments}]}
					res.send(resPosts)
				})
			})
		}, { public_id: publicName })
		// we create a passthrough stream to pipe the buffer
		// to the uploadStream for cloudinary.
		var s = new stream.PassThrough()
		s.end(req.file.buffer)
		s.pipe(uploadStream)
		s.on('end', uploadStream.end)
		// and the end of the buffer we tell cloudinary to end the upload.
	}
	else{	//post with text only
		new Post({ id: md5(timeNow+author), author: author, img: null, 
			date: timeNow, body: req.body.body,
			comments:[]}).save(function(result){
			//send back the latest added post
			Post.findOne().sort({date: -1}).exec(function(err,newPost){
				var resPosts = {posts:[{ id: newPost.id, author: newPost.author,
					img: newPost.img, date: newPost.date, 
					body: newPost.body, comments: newPost.comments}]}
				res.send(resPosts)
			})
		})
	}

}

/**
*	Update the post :id with a new body if commentId is not 
*	supplied. Forbidden if the user does not own the post. 
*	If commentId is supplied, then update the requested 
*	comment on the post, if owned. If commentId is -1, then 
*	a new comment is posted with the body message.
**/
function updatePost(req, res){
	var reqId = req.params.id
	Post.findOne({id:reqId}).exec(function(err, post) {
		var newBody = req.body.body
		if(!req.body.commentId){//edit post body only
			if(post.author != req.username){
				//the user doest not own th post, forbidden
				return res.sendStatus(403)
			}
			post.body = newBody
		}
		else{// edit/add comment
			if(req.body.commentId == -1){//add comment
				var timeNow = new Date().getTime()
				post.comments.push(
					{commentId:md5(timeNow+req.username),
					author:req.username, body: newBody, 
					date:timeNow})
			}
			else{//edit comment body
				post.comments.forEach(function(comment){
					if(comment.commentId == req.body.commentId && comment.author == req.username){
						comment.body = newBody
					}
				})
			}
		}
		post.save()
		var resPost = {posts:[{ id: post.id, author: post.author,
				img: post.img, date: post.date, body: post.body,
				comments: post.comments}]}
		res.send(resPost)
	})
}