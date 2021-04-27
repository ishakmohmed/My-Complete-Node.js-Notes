// file starts from express-advanced topics, video 8- debugging...

// NOTE: for line below, app:startup is a NAMESPACE;
const debug = require("debug")("app:startup"); // in terminal > set DEBUG=app:startup so only "custom console.log" will be shown in this line debug() if you have multiple NAMESPACES in console to make it simple just do something like > set DEBUG=app:startup, somethingelse, somethingelse      OR  just use '*' to select all kinds of debugging stuffs OR DEBUG=    < nothing so you cant see any debug messages, instead of console.log('Morgan is now enabled...') somewhere below. can create another one too for other purposes (duplicate this line to make it easy);

// SHORTCUT: DEBUG=app:startup nodemon index4.js;   << mosh didnt use "set"

const morgan = require("morgan");
const express = require("express");
const app = express();

console.log(`NODE_ENV is > ${process.env.NODE_ENV}`);
console.log(`app: ${app.get("env")}`);

// ************************************************************
// ************************************************************
// ************************************************************

// TEMPLATING ENGINE (PUG) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.set("view engine", "pug"); // express will internally load this pug module, you just install pug (templating engine) from terminal;
app.set("views", "./views"); // optional (only if you wanna override path to template)

app.get("/", (req, res) => {
  res.render("index", { title: "My express app!", message: "message..." }); // arg1- name of view (index.pug), arg2- obj that has all args of params
});

// ************************************************************
// ************************************************************
// ************************************************************

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get("env") === "development") {
  // instead on console.log. All cause of require('debug') line.
  app.use(morgan("tiny"));
  debug("Morgan is now enabled hehehe...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
