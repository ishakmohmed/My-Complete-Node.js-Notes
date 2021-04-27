// This file starts from Express- Advanced Topics video 4- Built-in Middleware;
const morgan = require("morgan"); // Express middleware- HTTP request logger.
const helmet = require("helmet"); // this 3rd party middleware returns fn
const Joi = require("joi");
const logger = require("./logger");
const authenticator = require("./authenticator");
const express = require("express");
const authenticate = require("./authenticator");
const app = express();

app.use(express.json()); // built-in middlware;
app.use(express.urlencoded({ extended: true })); // another built-in middleware, parses incoming requests with url encoded payloads (key=value&key=value), basically request with body like > key=value&key=value. This middleware also populates req.body (like a json object);
// extended: true > can pass arrays and complex objects using url encoded format;
app.use(express.static("publicFolder")); // final built-in middleware in express (check .txt file in this folder for more details)
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(morgan("tiny")); // HTTP request logger (try in postman with any http request, see result in console by default). Simplest format is used here, but you can specify various formats rather than "tiny", read documentation!;
app.use(logger);
app.use(authenticator);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found!");
  res.send(course);
});

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

function validateCourse(course) {
  // The updated way to use Joi validation >
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found!");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
