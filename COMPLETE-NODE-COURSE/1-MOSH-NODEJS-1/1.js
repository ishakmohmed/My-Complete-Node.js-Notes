// console.log(); // console obj is global obj;
// window.console.log(); // or console.log() like this. if you drop the window prefix, it'll be automatically be added because console.log() is defined globally (so same concept applies to stuffs that are defined globally);

// // other global obj in JS...;
// setTimeout(); // used to call fn after delay. can use in browser, client, node;
// clearTimeout();

// setInterval(); // used to repeatedly call.... (after timeout ofc);
// clearInterval();

// var message = ""; // unlike in client JS, in Node, variables (and functions) defined here arent added to global object, they're only scoped to this 1.js file;
// console.log(global.message); // therefore, output here is undefined;

// // in Node (of course, you can just not prefix these with "global") >>>
// global.setTimeout(); // now prefix with "global";
// global.console.log();

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// console.log(module); // may appear global, but no!
// // note: in node, every file is a module, and variables and functions defined in that file are module-scoped!

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// const log = require("./2 (logger)"); // require fn in node, NA in browser, it's local to each module (btw, its an arg of module wrapper function in each module, thats why);
// // note: ../ for parent folder;
// log("some message..."); // log() in this line is log const above which now I can call as fn cause require() above imports a single log() fn from 2.js in this case;

