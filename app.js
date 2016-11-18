var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var bodyParser = require('body-parser');

  var $ ;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

     $ = require("jquery")(window);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// public app
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/listItems' , function(req,res){
  fs.readFile( __dirname + "/" + "items.json", 'utf8', function (err, data) {
      console.log( data );
      res.json(JSON.parse(data));
  });
});


app.post('/buyPixel' , function(req,res){
    console.log("body element :"  , req.body.ymin)
    var dataImages = null ;
    var xminVal , xmaxVal , yminVal , ymaxVal ;
    xminVal  = req.body.xmin;
    xmaxVal  = req.body.xmax;
    yminVal  = req.body.ymin;
    ymaxVal  = req.body.ymin;
    fs.readFile( __dirname + "/" + "items.json", 'utf8', function (err, data) {
        var items = JSON.parse(data).item;
        var boolean = true ;
        for (var i = 0; i < items.length; i++) {
                  if(items[i].Xmin == xminVal ||  items[i].Xmax == xmaxVal || items[i].Ymin == yminVal || items[i].Ymax == ymaxVal ){
                          boolean  = false ;
                          break;
                  }
          }
        res.json({"status":boolean});
    });

});

var server = app.listen(8081, function(){

 var host = server.address().address
 var port = server.address().port

 console.log("Example app listening at http://%s:%s", host, port)
});
