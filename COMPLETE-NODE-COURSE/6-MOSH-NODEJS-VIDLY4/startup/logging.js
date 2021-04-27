const winston = require("winston");
require("winston-mongodb");
require("express-async-errors"); //EXPRESS-ASYNC-ERRORS wraps all route handlers in try-catch block, it’ll wrap your code within a try/catch block during runtime / "MONKEY-PATCH" your route handlers at runtime, and pass unhandled errors to your error middleware. this package isnt related to the function below, but its belongs in this module which is all about handling and logging errors!

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }), // add this, so when you open on different machine you'll also see the unhandled exceptions on console, so a new developer on team will know whats going on !
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error", // up till error from the top of the following list >>>
      // error
      // warn
      // info
      // verbose
      // debug
      // silly
    })
  );
};
