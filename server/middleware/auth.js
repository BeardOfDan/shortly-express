const models = require('../models');
const Promise = require('bluebird');
const Users = models.Users;
const utils = require('../lib/hashUtils');




// NOTE: checkForACurrentSession must be what calls this method
//  Otherwise, this may be overwriting a currently existing session.
module.exports.createSession = (req, res, next) => {
  // set cookie here for everywhere
  res.cookies = {};
  res.cookies.shortlyid = {value: 'OMG crazy default values!'};

  const makeNewSession = () => {
    // create the new session
    return models.Sessions.create(req.cookies)
        .then((result) => {
          const sessionId = result.insertId;
          models.Sessions.get({'id': sessionId})
            .then(function(result) {
              console.log('\n\nRESULT', result, '\n\n');
              
              // add the session property to request
              req.session = result;
              req.cookie = {'hash': req.session.hash, 'user': {'username': ''}, 'userId': req.session.userId};
            });
        });  
  };


  // check if the user already has a session
    // if so, then check if that session is valid
  if ((req.session !== undefined) && (req.session.hash !== undefined)) {
    models.Sessions.get(req.session)
      .then((result) => {
        if (result !== undefined) {
          // it's valid, so do the next thing
          next();
        } else {
          // it's not valid, so create a new session
          // createSession(req, res, next);
          makeNewSession();
        }
      });
  } else { // there is no session, so create a new session
    // createSession(req, res, next);
    makeNewSession();
  }


  // ============================================================================ //
  // much of the below code is likely invalid, or at least in need of refactoring //
  // ============================================================================ //


  
  // let newSession = models.Sessions.create(req.cookies);
  // console.log('\n\nNEWSESSION\n', newSession, '\n\n');

  req.session = req.cookies;

  if (req.cookies.shortlyid !== undefined) {
    // query the db for an entry with this value as the session hash
    // const thisSession = models.Sessions.get({'hash': req.session.hash});
    const thisSession = models.Sessions.get();

    console.log('\nSESSION\n', thisSession);

    const thisUser = models.Users.get({'id': thisSession.userId});

    console.log('\nTHISUSER\n', thisUser);

    // set req.session to be the values form thisSession
    req.sessions = {'hash': req.cookies.shortlyid, 'user': {'username': thisUser.username}, 'userId': thisSession.userId};

    console.log('\n\n', JSON.stringify(req.sessions, undefined, 2), '\n\n');

  } else {
    // next();
  }

  // initialize the values if there is nothing to assign to them
  if ((req.cookies.hash === undefined) && (req.cookies.shortlyid !== 'undefined')) {
    req.cookies = req.session = {'hash': utils.createRandom32String(), user: {'username': ''}, 'userId': null};
    req.cookies['shortlyid'] = '';
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
  data.hash = utils.createRandom32String();
  data.userId = thisNewUser.id;
  // data.uniqueSessionHash = utils.createRandom32String();

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













