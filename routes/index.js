const express  = require('express');
const passport = require('passport');

const Video = require('./../models/video');
const Account = require('../models/account');
const downloader = require('../services/download');

const router = express.Router();

// ROUTER MIDDLEWARE
router.use((req, res, next) => {
  console.log('something is happening');
  next();
});


// STATIC PAGES
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { });
});

router.post('/register', (req, res) => {
  Account.register(new Account({ username: req.body.username }), req.body.password, (err, account) => {
    if (err) {
      return res.render('register', { account });
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});

// API's
router.route('/api/videos')

  // create a new bear
  .post((req, res) => {
    // download video
    downloader.getVideo(req.body.videoId)
      .then((res) => {
        // debugger;
        // console.log('got all the result back', res);
      }); 
  })
  // get all vids
  .get((req, res) => {
    Video.find((err, vids) => {
      if (err) {
        res.send(err);
      }
      if (req.user) {
        res.json(vids);
      } else {
        res.json({ error: 'no user' });
      }
    });
  });





module.exports = router;
