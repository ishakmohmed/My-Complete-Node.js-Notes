// --------------------------------------
// Middleware/Middleware function: a fn that takes a request object and either returns response to client or passes control to another middleware fn, YOU CALL THIS REQUEST PROCESSING PIPELINE >
// 1- In Express, every route handler fn is a middleware fn;
// 2- another example of middleware is app.use(express.json()) in this file;
// --------------------------------------

const Joi = require("joi"); // returns class. use joi pkg for input validation;

// Loading modules which have custom middlewares >
const logger = require("./logger"); // returns middlware fn;
const authenticator = require("./authenticator"); // returns middleware fn;

// Express framework >
const express = require("express"); // returns a function;
const authenticate = require("./authenticator");
const app = express(); // returns Express obj;
app.use(express.json()); // enable parsing of JSON objects in body of request (disabled by default). express.json() returns a middleware fn, reads request, if there's json object in body of request, it'll parse the body of request into a json object, and then it'll set req.body property. ANOTHER MOSH EXPLANATION > express.json() parses body of request (using middleware fn), if there's json object, it'll set/populate req.body property;

// installing both custom middlewares (OPTIONAL TO ADD ROUTE BEFORE CUSTOM MIDDLEWARE) >
app.use(logger); // can just pass middleware fn here, but a better idea is what i did (placed in separate file).

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// NOTE: IF ONLY LINE ABOVE WAS > APP.USE('/API/ADMIN', logger) WHICH IS OPTIONAL to add '/API/ADMIN', THEN IT'LL NOT BE APPLIED ON ALL ROUTES, BUT ONLY THOSE WHICH START WITH /API/ADMIN;
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

app.use(authenticator);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello, world!");
}); // 1/4 http verb/methods;  // arg1: path, arg2: route handler/callback fn

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// app.get("/api/courses/:id", (req, res) => {
//   res.send(req.params.id);
// });

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found!"); // .send() is optional;
  res.send(course);
});

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params); // if req.params => {year: "2007", month: "9"}, if req.query, output query string parameters => {sortBy: "name"}, params are stored in obj with bunch of key-value pairs;
});
// note: in url after ?, query string parameters such as sortBy=name;
// route parameters for essential/required values, query string parameters for anything optional;
//localhost:3000/api/posts/2020/9?sortBy=name

// idk why, this comes outta nowhere in "Building RESTful APIs with Express Recap.pdf" >
// To read query string parameters (?sortBy=name),
// const sortBy = req.query.sortBy
//=============================================================================================
app.post("/api/courses", (req, res) => {
  // actually for below line, needa create schema and Joi.validate() but I extracted a fn & placed it below;
  const { error } = validateCourse(req.body); // object destructuring, actually returns error and value, but im only interested in error property. if error, error is [whatever], value is null | if value, value is [whatever], error is null;
  // because i did obj destructuring, in this line > error instead of obj.error >
  if (error) return res.status(400).send(error.details[0].message); // error only > too complex for client, so add details[0].message. Or you can do it your own way like instead of first element, access all element and get messages and concatenate them;

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found!");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

// extract out common codes (in put and post right above this message>
// NOTE: THERE'S A NEWER WAY TO JOI.VALIDATE() REFER INDEX2.JS;
function validateCourse(course) {
  const schema = {
    // Joi validation, 1st create schema
    name: Joi.string().min(3).required(), // Joi would prepare proper error messages;
  };

  return Joi.validate(course, schema); // returns error and value, if error, error is [whatever], value is null | if value, value is [whatever], error is null;
}
//=============================================================================================
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found!");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});
//=============================================================================================
// PORT here is environment variable: a var thats part of environment in which a process runs. its value is set outside of this application (cmd > set PORT=123);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`)); // arg2 - optional

