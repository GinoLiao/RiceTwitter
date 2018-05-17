/*******************
***** Demo server***
*******************/
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var enableCORS = function(req, res, next){
	res.header('Access-Control-Allow-Origin', req.get('Origin') || '*')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	res.header('Access-Control-Expose-Headers', 'Content-Length');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

	if(req.method == 'OPTIONS'){	 
		return res.send(200)
	} else {
		return next()
	}
}

var app = express()
app.use(logger('default'))
app.use(bodyParser.json({ limit:'10mb'}))
app.use(cookieParser())
app.use(enableCORS)

require('./app_server/auth.js').setup(app)
require('./app_server/following.js').setup(app)
require('./app_server/posts.js').setup(app)
require('./app_server/profile.js').setup(app)

if (process.env.NODE_ENV !== "production") {
    require('dot-env')
}

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000
exports.port = port

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})

