const express = require("express");
// const app = express() < doesn't work cause you're separating routes to separate module, so >
const router = express.Router(); // instead of working with app obj, work with router obj;

// HOW TO SEPARATE ROUTES TO DIFFERENT MODULES?
// 1- do whatever you did in above 2 lines
// 2- at bottom, module.exports = router;

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

router.put("/id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given id was not found");
  res.send(course);
});

function validateCourse(course) {
  // updated way to use Joi;
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(course);
}

module.exports = router;
