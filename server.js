var favicon = require('serve-favicon');
var express = require('express');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var request = require ('request')
var fs = require('fs');
var db = require('./dbengine');
var Users = require('./users');
var User = require('./user');



var app = express();

app.use (function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log (req.method + ' ' + req.url)
	next ()
})

app.use(session(
{
  secret: 'ourSecret',
  resave: false,  
}));

app.set('views', __dirname + '/www/views');
app.set('view engine', 'ejs');
app.use(partials());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('datafile', __dirname + '/data/giphy.json');

app.set('port',  3000);

app.use(express.static(__dirname + '/www'));
app.use(favicon(__dirname + '/www/images/favicon.ico'));

app.get('/', restrict, function(req, res) {
    renderView (req, res, 'index')
})



app.get('/oauth', function(req, res) {
  console.log ("oauth we are in " + req.query.code)
  if (req.query.code !== undefined) {
    authorizeSession (req, res)
  } else {
     res.redirect ('/');
 }
  
});

app.post ('/giphy', restrict, function (req, response) {

	console.log ('saving gohy');
	var giphy = req.body;

	var fname = app.get ('datafile')
	console.log (fname);
	var content = [];
	fs.readFile (fname, function (err, res) {
		if (! err) {
			console.log ('no file')
			content = JSON.parse (res)

		}
		content.push (giphy);
		fs.writeFile (fname, JSON.stringify (content), function (err, suc) {
			if (err) {
				console.log ('error' + JSON.stringify (err));
				response.status (500).send('failed');

			} else {
				console.log ('success' + JSON.stringify (suc));
				response.status(200).send('saved');


			}

			console.log ('file written')
		})


	})
//	console.log (JSON.stringify (req.body));

});

//// Use this route for proxying access token requests
//app.use('/api', api);

var server = app.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});


app.get('/login', function(req, res) {
  console.log ('render login')
  renderView(req, res, 'login');
});



app.post('/login', function(req, res) {
  console.log ('posting login')
  var username = req.body.username;
  var password = req.body.password;
   console.log ('username=', username, 'password=', password)

   new User({ username: username, password: password }).fetch().then(function(found) {
    if (found) {
      console.log ('Fpond')
      authorizeSession (req, res)
     
    }  else {
        console.log ('not found')
        res.redirect ('/login');
    }
  });
 
});

app.get('/signup', function(req, res) {
  console.log ('render signup')
  renderView(req, res, 'signup');
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
   var password = req.body.password;

   console.log ('Sign up username=', username, 'password=', password)


   new User({ username: username }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
    
        Users.create({
          username: username,
          password: password
        
        })
        .then(function(newUser) {
          authorizeSession (req, res)
        
        }); // then
    } //  else
  });
});

app.get('/logout', function(req, res) {
  console.log ('render logout')
  endSession (req, res)
});



function restrict(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

function authorizeSession (req, res) {
  req.session.authenticated = true;
  req.session.authcode = req.query.code;
  res.redirect ('/');

 }

 function endSession (req, res) {
  req.session.authenticated = false;
  req.session.authcode = '';
  res.redirect ('/');

}


 function renderView (req, res, viewname) {
 	console.log ('render view ' + viewname)

    res.render(viewname)
    
}


