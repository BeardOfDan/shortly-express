const models = require('../models');
const Promise = require('bluebird');
const Users = models.Users;

// NOTE: the cookie must be created before this method is invoked
module.exports.createSession = (req, res, next) => {
  models.Sessions.create(req.cookies);  
  req.session = req.cookies;
  console.log('This is within the Auth.js file ' + JSON.stringify(req.cookies, undefined, 2));
  
  // initialize the values if there is nothing to assign to them
  if (req.cookies.hash === undefined) {

    console.log('cookies keys', Object.keys(req.cookies));
    console.log('session keys', Object.keys(req.session));

    req.cookies = req.session = {'hash': '', 'userId': ''};

    console.log('cookies keys', Object.keys(req.cookies));
    console.log('session keys', Object.keys(req.session));

  }

  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (req.session !== undefined) { // if the request object has a session variable
    const sessionVal = models.Sessions.get(req.session);
    if (sessionVal === undefined) { // if there is no valid session
      res.setHeader('Set-Cookie', null);
      res.redirect('/login');
    } else { // send them on their way
      next();
    }
  } else { // direct them to log in
    req.session = {userId: '', hash: ''};
    res.redirect('/login');
  }

};

module.exports.createUser = (req, res, next) => {
  models.Users.get({'username': req.body.username})
    .then(user => {
      if (user === undefined) { // if there is no entry for that username in the database
        models.Users.create({username: req.body.username, password: req.body.password});

        next();
      } else { // that username already exists, so redirect them to log in
        // res.redirect('/login');
        res.redirect('/signup'); // By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Testsß
      }
    })
    .catch((e) => {
      console.log('Error:', e);
      res.redirect('/');
    });
};

module.exports.logout = (req, res, next) => {
  if (req.cookies !== undefined || req.session !== undefined) {
    var userSession = models.Sessions.get(req.session);
    if (userSession !== undefined) {
      models.Sessions.delete(req.session);
      res.setHeader('Set-Cookie', null);
      next();
    } else {
      res.setHeader('Set-Cookie', cookie);
      res.redirect('/login');
    }
  }
};

module.exports.createCookie = (req, res, next) => {
  // create the cookie here
  const thisNewUser = models.Users.get({username: req.body.username});

    // create cookie
  const data = {};
  data.hash = thisNewUser.password;
  data.userId = thisNewUser.id;

  const dataKeys = Object.keys(data);

  let arr = [];
  
  for (let i = 0; i < dataKeys.length; i++) {
    const crumb = dataKeys[i] + '=' + data[dataKeys[i]];
    arr.push(crumb);
  }    

  // create the cookie
  const cookie = arr.join(';');

  // pass it along for our internal use
  req.headers.cookie = cookie;

  // pass it along for the user
  res.setHeader('Set-Cookie', cookie);
  next();
};

// check if the posted info is valid user credentials
module.exports.validateLogin = (req, res, next) => {
  // if it exists, get the data associated with the supplied username
  const actualUserData = models.Users.get({'username': req.body.username});

  // check the username
  if (actualUserData !== undefined) { // that user exists in the database
    // check the password
    if (models.Users.compare(req.body.password, actualUserData.password, actualUserData.salt)) { // the password is correct
      // the user is valid
      next();
    } else { // the password is incorrect
      // while the username exists, this is not the correct password
      res.redirect('/login'); // let the user try to log in again
      // res.redirect('/'); // By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Testsß
      // Chapter 8 Verse 240
    }
  } else { // there is no entry for this user
    // res.redirect('/signup'); // let the user create an account
    res.redirect('/login'); // By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Tests | By Holy Orders From The Sacred Testsß
  } 
};













