var http = require('http'),
	url = require('url'),
	fs = require('fs');

http.createServer(function (request,response) { //handle request 

	var path = '.'+url.parse(request.url).pathname;

	fs.exists(path, function(exists) {
		console.log("it exists " + path);
		if( exists ) {
	        fs.readFile(path, function (err, data) {
  			if (err) {
  				response.writeHead(500, {
	            'Content-Length': err.length,
	            'Content-Type': 'text/html' })
	            response.end(err);
	            return;
  			} else {
  				response.writeHead(200, {
	        	'Content-Type': 'text/html' })
	        	response.end(data);
  				console.log(data);
  			}
			});
		}
		if( !exists ) {
			response.writeHead(404, {
            'Content-Type': 'text/html' })
            return;
		}
		
	});


}).listen(8125);


