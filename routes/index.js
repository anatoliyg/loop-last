const express   = require('express');
const passport = require('passport');

const Video = require('./../models/video');
const Account = require('../models/account');
const downloader = require('../services/download')



const router = express.Router();

//ROUTER MIDDLEWARE
router.use((req, res, next) => {
	console.log('something is happening');
	next();
});


///STATIC PAGES
router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});




// API's
router.route('/api/videos')
	//create a new bear
	.post(function(req, res) {

		downloader.getVideo(req.body.videoId)
			.then( (res) => {
				console.log('got the result back', res);
			});

		//console.log('vid name', req.body);

		var vid = new Video();
		vid.name = req.body.name;
		vid.dateCreated = new Date();
		vid.dateEdited = new Date();
		// vid.pathToV:String,
		// vid.pathToA:String,
		// vid.length:Number,
		// vid.origAuthor:String,
		// vid.vCompleted: Boolean,
		// vid.aCompleted: Boolean,
		// vid.inProgress: Boolean,
		// vid.title:Boolean,
		// vid.pathToThumbs: Array


		// downloader.get()
		// 	.then( (res) => {
		// 		console.log('got the result back', res);
		// 	});

		// vid.save( (err) => {
		// 	if(err)
		// 		res.send(err);

		 	res.json({message: 'vid created'});
		// })
	})
	//get all vids
	.get(function(req, res) {
		Video.find( (err, vids) => {
			if(err)
				res.send(err);
			
			if(req.user)
				res.json(vids);
			else
				res.json({error: 'no user'});
		} )
	});


router.route('/api/videos/:video_id')
	.get( function(req, res){
		Video.findById(req.params.video_id, (err, video) => {
			if(err)
				res.send(err);
			res.json(video);
		})
	})
	.put( (req, res) => {
		Video.findById(req.params.video_id, (err, video) => {

			if(!video)
				res.json({message: 'video not found'});

			if(req.body.name)
			video.name = req.body.name;

			if(req.body.dateEdited)
			video.dateEdited = req.body.dateEdited;

			if(req.body.dateCreated)
			video.dateCreated = req.body.dateCreated;

			video.save( (err) => {
				if(err)
					res.send(err);

				res.json({message: `video ${video.name} was updated`});
			});
		});
	})


module.exports = router;
