// var dotenv = require('./dotenv')
var express = require('express')
var urlExists = require("url-exists")
var mongoose = require("mongoose")
mongoose.Promise = global.Promise

// Setting up express.
var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.set('port', (process.env.PORT || 8080))

// const mlaburi = process.env.LAB_URI
// const mlaburi = 'mongodb://userfcc:passfcc@ds137139.mlab.com:37139/test-fcc'
const mlaburi = process.env.LAB_URI2
// mlaburi.config()
// console.log(mlaburi)
const siteSchema = new mongoose.Schema({
        original: String,
        shortened: String,
        short: String
})
const Siteinfo = mongoose.model('siteinfo', siteSchema)
mongoose.connect(mlaburi, (err, res) => {
  if(err) console.log("error", err)
  else console.log('Houston We are connected to: mLab')
})
// mongoose.connect(mlaburi)

// Helper Functions
function randomShort()
{
    var text = "/";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get('/', function (req, res) {
    res.render('index', {title: "url Shortener"})
})

app.get('/*', (req, res)=> {
    const qurl = req.url.substr(1)
    const validRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    
    if(qurl.length === 5){
        Siteinfo.findOne({short: qurl}).then((result)=> {
            res.redirect(result.original)
        })
    } else if(validRegex.test(qurl)){
      const shrt = randomShort()  
      const newSite = new Siteinfo({
          original: qurl,
          shortened: `${req.protocol}://${req.get('host')}${shrt}`,
          short: shrt.substr(1) 
      })  
    newSite.save().then(()=> {
        res.send({original: newSite.original, shortened: newSite.shortened})
    })
    } else {
        res.send({original: qurl, shortened: null})
    }
})

// app.get('/*', (req, res)=> {
    
//     const validRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
//     const qurl = req.url.substring(1)
//     Siteinfo.findOne({short: qurl}).then((result)=> {
//         // responseFromdb = result.sitefull 
//         if(result){
//             console.log('redirecting')
//             res.redirect(result.sitefull)
//         } else {
//             console.log("this sitefull is not found: ", result)
//         }
//     })
    
//     // if(responseFromdb){
//     //   res.redirect(responseFromdb) 
//     // }
//     // else 
//     if(validRegex.test(qurl)){
//         const rndm = randomShort()
//         const shrtnd = `${req.protocol}://${req.get('host')}${rndm}`
//         const siteinfo = new Siteinfo({sitefull: qurl, siteshortened: shrtnd, short: rndm.substring(1)})
//         siteinfo.save().then(()=> {
//             res.send({"original url": qurl, "shortened url": shrtnd})
//         }) 
//     }else {
//         res.send({"original url": req.url, "shortened url": null})
//     }    
    
//     // urlExists(req.url.substring(1), function(err, exists){
//     //     if(err) console.log(err)
//     //     if(exists){
//     //         var shortened = req.protocol +'://'+req.get('host') + randomShort()
//     //         var shortToDB = new Siteinfo({
//     //             sitefull: req.url.substring(1),
//     //             siteshortened: shortened    
//     //         })
//     //         Siteinfo.findOne({sitefull: shortToDB.sitefull}).then((result) => {
//     //             if(result){
//     //                 res.redirect(result.sitefull)
//     //             }else {
//     //                 // res.send({"old url": result.sitefull, "shortened url": result.siteshortened})
//     //                 // console.log('Houston We have saved it')
//     //                 shortToDB.save().then(()=> {
//     //                     Siteinfo.findOne({_id: shortToDB._id}).then((result)=> {
//     //                             res.send({"old url": result.sitefull, "shortened url": result.siteshortened})
//     //                     })
//     //                 })
//     //             }
//     //         })
           
//     //     } else {
//     //         res.send({"old url": req.url.substring(1), "shortened url": null})
//     //     }
//     // })
// })

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
