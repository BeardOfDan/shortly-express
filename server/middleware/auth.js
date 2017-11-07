const models = require('../models');
const Promise = require('bluebird');
const Users = models.Users;

// NOTE: the cookie must be created before this method is invoked
module.exports.createSession = (req, res, next) => {
  models.Sessions.create(req.cookie);  
  req.session = req.cookie;
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  const sessionVal = models.Sessions.get(req.session);
  if (sessionVal === undefined) { // if there is no valid session
    res.writeHead({'Set-Cookie': null});  
    res.redirect('/login');
  } else { // send them on their way
    next();
  }
};

module.exports.createUser = (req, res, next) => {
  models.Users.get({'username': req.body.username})
    .then(user => {
      if (user === undefined) { // if there is no entry for that username in the database
        models.Users.create({username: req.body.username, password: req.body.password});
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
        res.writeHead({'Set-Cookie': cookie});
        next();
      } else { // that username already exists, so redirect them to log in
        res.redirect('/login');
      }
    })
    .catch((e) => {
      console.log('Error:', e);
      res.redirect('/');
    });
};


