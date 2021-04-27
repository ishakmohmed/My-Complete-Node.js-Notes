// Built-in Path module >>>
const path = require("path"); // by default, node assumes this arg in require() is a built-in module first not module i create, if no exist, node looks for existence of a relative path to file, so if ./ or ../ then node assumes its a file in this application, btw require(path) here returns an object;

var pathObj = path.parse(__filename);
console.log(pathObj); // informal but right: it prints an obj with bunch of key values, crazyy;

// therefore, if you wanna work with path, its better to use path module than to use strings;

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Built-in OS Module >>>
const os = require("os");

console.log(`Total memory: ${os.totalmem()}
Free memory: ${os.freemem()}`);
// Total memory: 8503136256
// Free memory: 4211310592

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
console.log("X X X X X X X X X X X X X X X X X X X X");
console.log("X X X X X X X X X X X X X X X X X X X X");
console.log("X X X X X X X X X X X X X X X X X X X X");
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Built-in File System Module (avoid using Synchronous (blocking) method, select Asynchronous (non-blocking) instead) >>>

const fs = require("fs");
const files = fs.readdirSync("./"); // in this case returns all files in this folder, result is string array;
console.log(files);

// up (sync) & below (async) method = same result;

fs.readdir("./", function (err, files) {
  // error arg, string array arg;
  if (err) console.log("Error", err);
  else console.log("Result", files);
}); // all async takes fn as last arg (callback fn) which will be called when async operation completes;

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Events Module (an event is a signal that something has happened) >>>

// const EventEmitter = require("events"); // Returns EventEmitter class;

// note: if you register listener after calling emit(), nothing would happen, cause emit() iterates over all registered listeners and calls them synchronously;

// some event is raised in 2 (logger).js, here, im listening to that event >

const Logger = require("./2 (logger)"); // in this case, you're importing a class;
const logger = new Logger();

logger.on("messageLogged", (arg) => {
  // arg elem is optional (depends on who emit());
  // "hey logger, when you raise this "messageLogged" event, I want to execute this code (arrow function here)"
  console.log("Listener called!!!", arg); // arg here > {id: 1, url:"http://"}
}); // register a listener, use on() OR addListener(). 1st arg is name of event, 2nd is callback fn (actual listener);

logger.log("message"); // output is > message, in next line > Listener called!!! { id: 1, url: 'http://' };