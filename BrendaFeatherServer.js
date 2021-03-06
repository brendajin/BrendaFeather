var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    qs = require('querystring');


http.createServer(function (request,response) {
    console.log('server running');

	var path = url.parse(request.url).pathname;
    var querystring = url.parse(request.url, true).query;  //return an object from a querystring with raw name-value pairs.
    var body = makeBody(path, querystring);

    response.writeHead(200, {
    	'Content-Length': body.length,
	    'Content-Type': 'text/html' }
    );

    request.form = '';
	request.addListener('data', function(chunk) {
        //handle a chunk of data, passed in as a buffer.
        //Buffers are easily transformed to strings.
        request.form += chunk.toString();
    });

    //This event is emitted when we reach the end of the request body.
    //In some cases, we might never reach the end, because the connection is prematurely closed. We want to check for that.
	if ( path !== '/favicon.ico') {

    request.addListener('end', function() {
        if (request.method == 'POST') {
            request.form = qs.parse(request.form);
            var appendData = '{name: \'' + request.form.name + '\', email: ' + request.form.email + ', dessert: ' + request.form.dessert + '} \n';
            fs.appendFile('stuff.txt', appendData, 'utf8', function(err) {
            	if(err) throw err;
            	console.log('The data to append ' + appendData + ' was appended to the file');
	        });
	        console.log(request.form.name);
	        console.log(typeof request.form.name);
	        var username = request.form.name;
	        var body = makeBody('/submit', username);
	        console.log('50: ' + username);
        }
        //Request exists in a higher "scope" than this listener callback.
        //thus, we can use this property to indicate a "state". If we've "ended", it will be true. Otherwise, undefined.
        //This is useful in case a "close" event fires before "end".
        request.ended = true;
        
    });

    }

    // this is a race condition if put in the wrong place
    response.end(body);
    //This event is emitted when the connection is closed.
    request.addListener('close', function() {
        //Checking for an edge case, in this case, we didn't get the entire message.
        if (!request.ended) {
            //Request died midway through. Throw an error.
            request.terminated = true;
            return;
        }
    });
}).listen(process.env.PORT || 8124);

function makeBody(path, querystring) {
    var compiledPage = new events.EventEmitter();

    compiledPage.addListener('readFile', function() {
        if (compiledPage.headerLoaded === true && compiledPage.footerLoaded === true) {
            compiledPage.data = {};

            for (var key in data) {
                compiledPage.data[key] = data[key];
                console.log("in for: " + compiledPage.data[key]);
            }
            compiledPage.data.body = compiledPage.body;

            var source = _.template(compiledPage.container, compiledPage.data); //Oh look! The point of the exercise!

            callback(source);
        }
    });


    fs.readFile('header.html', function(err, data) {
        if(err) throw err;
        data.toString();
        console.log("line 8: " + data);
        compiledPage.headerLoaded = true;
        compiledPage.emit('readFile');
    });
    fs.readFile('footer.html', function(err, data) {
        if(err) throw err;
        data.toString();
        console.log("line 13: " + data);
        compiledPage.footerLoaded = true;
        compiledPage.emit('readFile');
    });

    var body = header;
    console.log("80: " + header);
    var userName = querystring || 'lady';


	switch (path) {
		case '/':
			body += '<form method="POST" action="submit"><label>Name</label><input type="text" name="name"></input><label>Email</label><input type="text" name="email"></input><label>Dessert</label><input type="text" name="dessert"></input><input type="submit" name="submit"></submit></form>';			
			break;

		case '/submit':
			console.log('83: ' + typeof userName);
			console.log('84: ' + userName);
			body += "Hello, " + userName + "!";
	  		break;	

	  	case '/favicon.ico':
	  		console.log('fetching favicon.ico');
	  		break;

		default:
			body += "Error";
	}

    body += footer;
    return body;
};
