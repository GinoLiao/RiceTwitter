(function(jasmine) { 	
	var $q
	var promises = []

	function init(_$q_) {
		$q = _$q_
	}

	function makePromise(response) {
		var p = $q.defer()
		promises.push({ promise: p, response: response })
		return { $promise: p.promise }
	}
	var serverposts = { posts: 
				[{
					'author':'Test',
					'id':'1',
					'date':'Today',
					'body':'... test post ...',
					'comments':[{
						'commentId':'1',
						'author':'test comemnt',
						'date':'Today',
						'body':'test comment body'
					}]
				},
				{
					'author':'Test2',
					'id':'2',
					'date':'Today2',
					'body':'... test post22 ...',
					'comments':[{
						'commentId':'1',
						'author':'test comemnt',
						'date':'Today',
						'body':'test comment body'
					}]
				}]
			}
	var emails = [{username:"zl15test", email:"zl15test@rice.edu"}, {username:"test", email:"test@rice.edu"}]
	var zipcodes = [{username:"zl15test", zipcode:"77005"}, {username:"test", zipcode:"77777"}]
	
			
	var mockApiService =  {
		getPosts: function() {
			return makePromise(serverposts)
		},
		getStatus: function() {
			return makePromise(
				{ statuses: [{'status':'Test Status'}] }
			)
		},
		setStatus: function(payload) {
			return makePromise(
				{'status':payload.status}
			)
		},

		// XXX add the login and logout functions here
		login: function(payload) {
			return makePromise(
				{'username': payload.username, 'result':'success'}
			)
		},
		
		logout: function() {
			return makePromise('OK')
		},
		
		addPost:function(payload){
			//copy the serverposts to a new var to not affect later tests
			var resServerPost = JSON.parse(JSON.stringify(serverposts));
			serverposts.posts.push({
					'author':'TestAdd',
					'id':'3',
					'date':'Today',
					'body':payload.body,
					'comments':[{
						'commentId':'1',
						'author':'test comemnt',
						'date':'Today',
						'body':'test comment body'
					}]
				})
			return makePromise(serverposts)
		},
		
		
		editPost: function(payload1,payload2){
			
			serverposts.posts.forEach(function(post){//find post

				if(post.id == payload1.id){
					if(!payload2.commentId){//edit post body
						post.body = payload2.body
					}
					else{
						if(payload2.commentId == -1){//add comment
							post.comments.push({
								'commentId':'2',
								'author':'new comemnt',
								'date':'Today',
								'body':payload2.body
							})
						}
						else{//edit a comment
							post.comments.forEach(function(comment){
								if(comment.commentId = payload2.commentId){//find comment
									comment.body = payload2.body
								}
							})
						}
					}
				}
			})
			return makePromise(serverposts)

		},
		
		getPicture: function(){
			return makePromise({ pictures:
				[{
					'username': 'zl15test',
					'picture': 'https://randomuser.me/api/portraits/thumb/women/95.jpg'
				}]
			})
		},
		
		
		getEmail: function(payload){
			var resEmail
			emails.forEach(function(email){
				console.dir(payload)
				console.log(email.username == payload.user)
				if(email.username == payload.user){
					resEmail = email
				}
			})
			return makePromise(resEmail)
		},
		
		setEmail: function(payload){
			var resEmail
			emails.forEach(function(email){
				if(email.username == "zl15test"){	//set zl15test as loggedin user
					email.email = payload.email
					resEmail = email
				}
			})
			return makePromise(resEmail)
		},
		
		
		
		getZip: function(payload){
			var resZip
			zipcodes.forEach(function(zip){
				if(zip.username == payload.user){
					resZip = zip
				}
			})
			return makePromise(resZip)
		},
		
		setZip: function(payload){
			var resZip
			zipcodes.forEach(function(zip){
				if(zip.username == "zl15test"){
					zip.zipcode = payload.zipcode
					resZip = zip
				}
			})
			return makePromise(resZip)
		},
		
		setPassword: function(){
			
		},
		
		setPicture: function(){
			
		}
		
		
	}

	var resolveTestPromises = function(rootScope) {
		promises.forEach(function(p) {
			p.promise.resolve(p.response)
		})
		promises.length = 0
		rootScope.$apply()
	}

	jasmine.helper = {
		init: init,
		mockApiService: mockApiService,
		resolveTestPromises: resolveTestPromises
	}

})(window.jasmine)