// note: node doesnt execute these fns directly, instead it wraps them under a function called Module Wrapper Function (watch MOSH node course, Node Module System part, video 6 (Module Wrapper Function video))

// note: __filename & __dirname are arguments to model wrapper function in each module;
// console.log(__filename); // launch 1.js in terminal, output is complete path to this file;
// console.log(__dirname); // path to directory that contains this module;

const EventEmitter = require("events"); // this events module inside require() returns EventEmitter class;

// var url = "http://mylogger.io/log";

class Logger extends EventEmitter {
  // < instead of creating EventEmitter obj and accessing emit();
  log(message) {
    // sent an HTTP request...
    console.log(message);
    this.emit("messageLogged", { id: 1, url: "http://" }); // raise an event (its handled in 3.js). 2nd (onwards) optional arg(s) is event arg(s). BTW, emit() belongs to EventEmitter originally;
  }
}

module.exports = Logger; // initially, it was "module.exports.log = log;", but now ... = log; cause i dont wanna export log fn to an obj named log, but this single fn right away, UPDATE: now changed to = Logger;;

// therefore, in module, you can export an object or single function;

// NOTE: "exports" is a shortcut/reference (which is fixed, you cant override it like exports = 54) to "module.exports";
