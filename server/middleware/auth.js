const models = require('../models');
const Promise = require('bluebird');


const Users = models.Users;


module.exports.createSession = (req, res, next) => {
    
  // create a cookie / session

  let id = req.body.id;
  

  // do stuff with id


  // then if valid(next())
  // else, res.redirect(login);


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

  // console.log('in create user', '\n');
  // console.log('req.body', req.body);

  console.log('\n-------------------\n');


  console.log('users.get', Users.get({username: req.body.username}));

  if (Users.get({username: req.body.username}) !== undefined) {
    console.log('req.body.username', req.body.username);
    res.redirect('/login');
  } else {
    console.log('about to create this new user...');
    const queryResult = Users.create ({username: req.body.username, password: req.body.password});

    console.log('queryResult', queryResult);

    next();
  }
};

