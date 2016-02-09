var appPath = "/";
var viewPath = "/views";

var express = require('express');
var app = express();
var path  = require('path');
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

//static
app.use('/static', express.static(__dirname + appPath + 'public'));
app.use(express.static('public'));

//set up underscore + html rendering
var cons = require('consolidate');
var u = require('underscore'); //use 'u' to prevent name conflicts
app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, viewPath));

app.get('/', function(request, response) {

	//set up underscore, though for now we won't use it
	/**fs.readFile('./views/pages/index.html',{encoding: 'utf-8'}, function(err, html) {
		if(err) {
			throw err;
		}

	
		var template = u.template(html);
		response.send(template({'hello':'123'}))
	});**/

	response.send("Hello");
  	//response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


