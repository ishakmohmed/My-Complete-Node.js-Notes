// copied and pasted MOSH'S ANSWER!

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // since each movie has genre embedded inside it, needa validate genre too!
  const genre = await Genre.findById(req.body.genreId); //  <<<< THESE 2 LINES ARE NEW KNOWLEDGE!
  // NOTE: genreId here is from the Joi schema in movie.js in models!
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    // now all these properties are the properties in movie schema, which is basically how it will be stored in database, unlike Joi Schema which is what the client sends us!
    title: req.body.title,
    genre: {
      // instead of setting value based on request body, im setting it to a complex object with two properties!
      _id: genre._id, // the reason there is _id property although its not defined in schema is because _id is something mongodb will assign on its own, so each genre has _id which i can access as if I defined in schema because its pretty much like "mongodb helped me to add _id to genreSchema which I shouldnt define on my own"
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  // mongoose talks to mongodb driver to create an objectid for the movie created above right when it is created, NOTTT WHEN IT IS SAVED BECAUSE ITS MONGODB DRIVEEERRRRSSS' JOB, not mongodb where you have to wait, and wait, and wait.....

  await movie.save(); // i dont need to store result (I STRONGLY THINK ID) and the res.send(movie) in this line because id is created right when you create a movie in a couple of lines above in mongodb driver!

  res.send(movie); // basically i GUESS i wanna return id to the client!
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // since each movie has genre inside it >>>
  const genre = await Genre.findById(req.body.genreId); // "genreId" here is from Joi schema!
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,  // not req.body.genreId cause look at this put request's first arg, it's "/:id", SO NEED TO USE THAT ID when it comes to findByIdAndUpdate() or any findById()
    {
      title: req.body.title,  
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
