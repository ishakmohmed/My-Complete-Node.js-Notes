const winston = require("winston"); // const winston, in which winston here is the default logger that is exported from the winston module. YOU CAN ALSO CREATE A LOGGER MANUALLY (when you wanna have different loggers that behave differently in different parts of the application), but using the default logger is sufficient for small to medium sized application.

// above logger object, winston has a TRANSPORT, which is a storage device for our logs!
// winston comes with few core transports >

// Console -> for logging message on the console
// File
// Http -> for calling HTTP endpoints for logging messages

// NOTE: DEFAULT LOGGER COMES WITH ONE TRANSPORT AND THAT IS FOR LOGGING MESSAGES ON THE CONSOLE, but if you look at the code below, mosh will show you how to add transport to log messages in a file NOT THE DEFAULT CONSOLE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// THERE ARE ALSO PLUGINS FOR WINSTON, BASICALLY OTHER NPM MODULES, FOR LOGGING MESSAGES IN MONGODB, COUCHDB, REDIS, LOGGLY(very popular log analysis and monitoring service for enterprise applications)
// ----------------------------------------------------
// load this after loading winston >>>

require("winston-mongodb"); // <<< only require this, but require this after loading winston above it!

// ----------------------------------------------------
require("express-async-errors"); // YOU DON'T HAVE TO GET THE RESULT AND STORE IN CONSTANT!
// ^ this package will automatically wrap all route handlers in try catch block so all you need to do is load this package in index.js and that is all, you dont need to create a async.js middleware like you did before cause its too much of a manual work. IF YOU WANNA SEE THE MANUAL IMPLEMENTATION, CHECK OUT ASYNC.JS module in middleware folder.

// ^ NOTE: WHEN ABOVE express-async-errors package throws exception itll be caught and settled by the EXPRESS ERROR MIDDLEWARE FUNCTION WHICH I REGISTERED AT THE END OF THIS FILE;

// ^ NOTE: MOSH SAID THAT IF express-async-errors package doesnt work for whatever reason, you should use the kinda more manual approach (not as manual as wrapping all route handlers in try catch blocks lmao), which is to use a middleware function in this case, the asyncMiddleware function which was created but now commented out in this vidly project version under the folder name called "middleware"!
// ----------------------------------------------------
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

// *****************************************************************
// *****************************************************************
// *****************************************************************
// *****************************************************************
// *****************************************************************

// process.on("uncaughtException..... only works for synchronous code, NOT async code like promises!
// how to handle uncaught exceptions that are not part of request processing pipeline, which will be handled by try-catch block >>>
// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex); // 2nd arg is metadata of course!
//   process.exit(1); // best practice > terminate process and restart it!
// }); // in node we've got standard event called uncaughtException. This event is raised when we have an exception in node process, but nowhere we have handled that exception using a catch block.
// note: winston is implemented in error.js middleware, just "throw new Error()" in any route handlers to test it using POSTMAN!

// INSTEAD OF process.on("uncaughtException..... , YOU CAN WRITE CODE LIKE IN LINE BELOW to log messages, but its not gonna work for unhandledRejection, but there is a quick trick around this- in process.on("unhandledRejection..., throw the caught exception >>>
winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" }) // use same filename, or different filename!

  // winston will log the exception and then terminate the process!
);

// process.on("unhandledRejection", (ex) => {
//   winston.error(ex.message, ex); // will log message
//   process.exit(1); // best practice > terminate process and restart it!
// });

// ^^^ codes in above line is not compatible with winston.exceptions.handle(...), so a quick trick is that when you get unhandledRejection, throw the catched exception exception inside the function so winston.exceptions.handle(... can take care of that...

process.on("unhandledRejection", (ex) => {
  throw ex; // now it goes to winston.exceptions.handle(.....
});

winston.add(new winston.transports.File({ filename: "logfile.log" })); // different from what MOSH wrote but this line now works, ONLY THIS LINE IS DIFFERENT FROM WHAT MOSH WROTE FOR THIS ENTIRE FEATURE IN ALL MODULES!
winston.add(
  new winston.transports.MongoDB({
    // this transport also takes other properties, check documentation for more details!
    db: "mongodb://localhost/vidly",
    level: "error", // optional: means only UP UNTIL error messages will be logged. YOUVE GOT error, warn, info, verbose, debug, silly. So, if you write > level: info, that means only error, warn, and info WILL BE LOGGED ON MONGODB! please take note that the error is the most important message and silly is the least important message!
  })
); // this line is possible because of winston-mongodb package!

// throw new Error(
//   "Error: I threw this error to test if I handled uncaught exception correctly"
// ); // comment this line out when necessary!

// const p = Promise.reject(new Error("Something failed miserably!"));
// p.then(() => console.log("done!")); // comment/uncomment this line out when necessary!

// *****************************************************************
// *****************************************************************
// *****************************************************************
// *****************************************************************
// *****************************************************************

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Ishak, connected to MongoDB..."))
  .catch((err) => console.error("Ishak, could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// special middleware in express: error middleware, register after all other existing middleware functions like these ^^^ above >
app.use(error); // not calling the function, just passing reference to this function!
// ^ when we call next(ex) in route handlers catch block, we'll end up here because it's registered after all existing middleware functions!

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
