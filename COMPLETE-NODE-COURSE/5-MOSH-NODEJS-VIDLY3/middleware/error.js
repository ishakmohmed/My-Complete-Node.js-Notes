const winston = require("winston");

// special middleware function in express, its express error middleware function, will only get executed when there is error in express request processing pipeline >

module.exports = function (err, req, res, next) {
  // -------------------------------------------------
  // the additional parameter is added in front to the usual function you've seen all while, and that is the err parameter, the err argument value is from whichever route that calls it using next(ex) in its catch block, for example genres.js HTTP GET commented out codes, in catch block, kinda passes the control over here with along with the caught error > next(ex)!
  // -------------------------------------------------

  // over here, you wanna log the exception, I'M USING WINSTON IN THIS CASE >>>

  // winston.log('error', err.message); // either pass logging level followed by the error, or see line below (use helper methods) >>>
  winston.error(err.message, err); // 2ND OPTIONAL ARG IS METADATA // dont need to pass the first argument because this is winston.error() not winston.log() like in above line!
  // 1st argument, is the logging level (level of importance of message we're gonna log)!
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed.");
};
