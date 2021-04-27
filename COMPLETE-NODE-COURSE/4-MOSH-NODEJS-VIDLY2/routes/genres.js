const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// basically, ONLY AUTHORIZED USER CAN POST A NEW GENRE >>>>>>>>>>>>
router.post("/", auth, async (req, res) => {
  // 2nd arg is optionally a middleware fn (IF YOU WANNA PASS A LOT OF MIDDLEWARE, PASS AS AN ARRAY), 3rd is route handler. NOW THIS AUTH WILL BE EXECUTED BEFORE THE 3RD ROUTE HANDLER GETS EXECUTED!
  // to ensure this API endpoint can be called by authenticated users only, im passing a middleware fn as 2nd middle argument!

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

// NOTE: IF YOU WANNA PASSS A LOT OF MIDDLEWARE FUNCTIONS AS ARGUMENTS TO HTTP METHODS, NEEDA PASS AN ARRAY, BECAUSE THESE METHODS CAN ONLY TAKE A MAXIMUM OF 3 ARGUMENTS >>>>>>>>>>>>>>>>>>>>>>>

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
