const parseCookies = (req, res, next) => {
  var cookie = req.headers.cookie;

  // console.log('\n\nreq.headers:\n', req.headers, '\n\n');

  req.cookies = {};

  if (cookie !== undefined) { // get the data from the cookie
    var cookieArr = cookie.split(';');
    cookieArr.forEach (function (element) {
      var cookieTuple = element.split('=');
      req.cookies[cookieTuple[0].trim()] = cookieTuple[1].trim();
    });
  }

  next();
};

module.exports = parseCookies;