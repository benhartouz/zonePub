var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

// public app
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/listUsers' , function(req,res){
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
  });
});

var server = app.listen(8081, function(){

 var host = server.address().address
 var port = server.address().port

 console.log("Example app listening at http://%s:%s", host, port)
});
