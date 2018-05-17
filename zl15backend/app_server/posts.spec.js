/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./posts.js')

function url(path) {
	return "http://localhost:3000" + path
}

describe('Validate Post Functionality', function() {
	var myposts = [
		{ date:"January 3",  author:"Gino", id:"1",  body: "Happy Chinese New Year!", comments:[]},
		{ date:"January 3",  author:"Scott", id:"2", body: "Duncan Hall and ...", comments:[]},
		{ date:"December 25", author:"Scott", id:"3" , body: "Merry Christmas!", comments:[]}	
	];

	it('should give me three or more posts', function(done) {		
		request(url("/posts"), function(err, res, body) {
			expect(res.statusCode).toBe(200);		
			expect(JSON.parse(body).posts.length).not.toBeLessThan(3)
			done()
		})
 	}, 500)
	
	it('should return a post with a specified id', function(done) {
		// call GET /posts first to find an id, perhaps one at random
		var chosenId
		request(url("/posts"), function(err, res, body) {
			chosenId = getRandomInt(1, JSON.parse(body).posts.length)
			// then call GET /posts/id with the chosen id
			var newgetPostURL = "/posts/"+chosenId
			request( url(newgetPostURL),
						function(err, res, body) {
				// validate that only one post is returned
				expect(JSON.parse(body).posts.length).toBe(1)				
			})
		done()
		})
	}, 500)

	it('should return nothing for an invalid id', function(done) {
		//call GET /posts/id where id is not a valid post id, perhaps 0
		//confirm that you get no results
		request(url("/posts/:9932132"), function(err, res, body) {
			expect(body).toMatch("")
			done()
		})
	}, 200)
	 
	it('should add two posts with successive post ids, and return the post each time', function(done) {
		// get and count the current number of posts
		var numPosts
		request(url("/posts"), function(err, res, body) {
			expect(res.statusCode).toBe(200);		
			numPosts = JSON.parse(body).posts.length
		})
		// add a new post
		request({url: url("/post"),
				 method: "POST",
				 json: {body: "Happy new year!" }  },
					function(err, res, body) {
			expect(res.statusCode).toBe(200);
			// verify the content of the post
			expect(body.posts[0].body).toEqual("Happy new year!")
		})
		// get and verify the number of posts increased by 1
		request(url("/posts"), function(err, res, body) {
			expect(res.statusCode).toBe(200);	
			expect(JSON.parse(body).posts.length).toBe(numPosts+1)
		})
		done()
 	}, 500)

	


});


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}