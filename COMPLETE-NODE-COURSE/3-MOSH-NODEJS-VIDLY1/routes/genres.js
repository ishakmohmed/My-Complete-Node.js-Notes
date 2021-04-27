const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose"); // step 3
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // step 6
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", async (req, res) => {
  // step 7
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = new Genre({ name: req.body.name });
  await genre.save(); 
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // step 8
  // note: in this implementation, im gonna use the update first approach which mosh find more efficient;
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

router.delete("/:id", async (req, res) => {
  // Step 9
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  // Step 10
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
