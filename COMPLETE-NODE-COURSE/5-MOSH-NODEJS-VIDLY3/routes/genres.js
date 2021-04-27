// now you don't need the line below because im using express-async-errors package!
// const asyncMiddleware = require("../middleware/async"); // naming the exported function from async.js in middleware folder as "asyncMiddleware" right here!
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// BELOW COMMENTED OUT ROUTE HANDLER IS IMPROVED IN THE ROUTE HANDLER BELOW IT, BUT JUST REFER IT TO UNDERSTAND BETTER!

// router.get("/", async (req, res, next) => { // add third parameter as "next"
//   try {
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
//   }
//   catch (ex) {
//     next(ex); // &> to pass control to next middleware function in request processing pipeline (in this case express error middleware, which is declared after all middleware functions, and it should be declared like that)
//     // &> pass ex as arg, in which ex is the caught exception in catch block
//     // &> next(ex) here will bring control to the express error middleware in index.js, WHICH IS DECLARED AFTER ALL MIDDLEWARE FUNCTIONS, and it should be declared like that!
//   }
// });

// the route handler below (AND ALL ROUTE HANDLERS IN THIS FILE) is pretty much modified because i don't wanna add try catch block in all route handlers. So, the try-catch block is somewhere in a central place (async.js middleware), and all route handlers are using that, which means in every route handler, only super specific stuffs are written >>>
router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres!!!"); // <<< uncomment out this to test winston!

  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
