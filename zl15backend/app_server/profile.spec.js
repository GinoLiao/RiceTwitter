/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./profile.js')

function url(path) {
	return "http://localhost:3000" + path
}

describe('Validate Status Functionality', function() {

	it('should update the status for the loggedInUser', function(done) {
		//get current status
		var currentStatus
		request(url("/status"), function(err, res, body) {
			expect(res.statusCode).toBe(200);
			currentStatus = JSON.parse(body).statuses[0].status		
			//update status to "unhappy"
			var newStatus = currentStatus + " updated"	//make sure it's a different new status		
			request({url: url("/status"),
					 method: "PUT",
					 json: {payload: {status:newStatus} }  },
						function(err, res, body) {
				expect(res.statusCode).toBe(200);
				////// verify the content and author of the post
				expect(body.statuses[0].status).not.toEqual(currentStatus)
				
				//get to verify the status was changed to the new status
				request(url("/status"), function(err, res, body) {
					expect(res.statusCode).toBe(200);
					expect(JSON.parse(body).statuses[0].status).not.toEqual(currentStatus)
					expect(JSON.parse(body).statuses[0].status).toEqual(newStatus)		
					done()
				})
				
			})
		})
		
		
 	}, 500)


});


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}