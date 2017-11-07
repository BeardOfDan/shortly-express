const models = require('../models');
const Promise = require('bluebird');


const Users = models.Users;


module.exports.createSession = (req, res, next) => {
    
  // create a cookie / session

  
  console.log('in create session');
  console.log('req.body', req.body);

  console.log('\n-------------------\n');

  next();

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.validateSession = (req, res, next) => {

  // check the cookie (to make sure it exists with valid data)

  // if the data is valid, then next();
  // else redirect to log in page

  console.log('in validate session', '\n');
  console.log('req.body', req.body);

  console.log('\n-------------------\n');

  next();

};


module.exports.createUser = (req, res, next) => {
  models.Users.get({'username': req.body.username})
    .then(user => {
      if (user === undefined) {
        models.Users.create({username: req.body.username, password: req.body.password});
        next();
      } else {
        res.redirect('/login');
      }
    })
    .catch((e) => {
      console.log('Error:', e);
      res.redirect('/');
    });
};

