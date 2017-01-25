var express = require('express')
var urlExists = require("url-exists")

var app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.set('port', (process.env.PORT || 8080))

function randomShort()
{
    var text = "/";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get('/', function (req, res) {
    // res.send('Hello World!, its me again, and again from nodemon')
    res.render('index', {title: "url Shortener"})
})

app.get('/*', (req, res) => {
    urlExists(req.url.substring(1), function(err, exists){
        if(err) console.log(err)
        if(exists){
            var fullUrl = req.protocol +'://'+req.get('host') + randomShort()
            res.send({"old url": req.url.substring(1), "shortened url": fullUrl})
        } else {
            res.send({"old url": req.url.substring(1), "shortened url": null})
        }
    })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
