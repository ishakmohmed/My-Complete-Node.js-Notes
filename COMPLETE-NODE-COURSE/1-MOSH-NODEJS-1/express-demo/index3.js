// this file starts from Express- Advanced Topics, video 6- environments

const config = require("config"); // i created config folder. install config package first;
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const authenticator = require("./authenticator");
const express = require("express");
const authenticate = require("./authenticator");
const app = express();

console.log(`NODE_ENV is > ${process.env.NODE_ENV}`); // NODE_ENV environment var returns the environment for this node application (default=undefined, alt: set to development, testing, staging, or production);
console.log(`app: ${app.get("env")}`); // another way, uses env var internally in above line to detect current env, if it (process.node.NODE_ENV) is not set, it'll return development, NOT UNDEFINED! 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("publicFolder"));
app.use(helmet());
app.use(logger);
app.use(authenticator);

// informal but correct: I created a folder named config with 3 different files and the codes below will give output from 1 selected file only, which it'll automatically select;
console.log("Application name: " + config.get("name")); // if you change NODE_ENV, the result will change according to one of the files in config folder;
console.log("Mail server: " + config.get("mail.host"));
console.log("Mail password: " + config.get("mail.password")); // actual password is set in environment variable, in custom-environment-variables.json which has mail.password > "password": "app_password" only, where app_password is env variable that i created and set value. config here will look for password from various resources like configuration (json) files, env variable, command line argument;

// Enabling logging of http requests only on development machine >
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan is now enabled hehehe...");
}

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

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
  const schema = Joi.object({ name: Joi.string().min(3).required() });
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
