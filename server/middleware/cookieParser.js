const parseCookies = (req, res, next) => {
  var cookie = req.headers.cookie;

  const result = req.cookie = {};

  if (cookie === undefined) {
    next ();
  }

  var cookieArr = cookie.split(';');
  cookieArr.forEach (function (element) {
    var cookieTuple = element.split('=');
    result[cookieTuple[0]] = cookieTuple[1];
  });



  next();
};

module.exports = parseCookies;