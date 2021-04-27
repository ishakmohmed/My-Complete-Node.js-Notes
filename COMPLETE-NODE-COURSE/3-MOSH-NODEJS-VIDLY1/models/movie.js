// SINGLE RESPONSIBILITY PRINCIPLE: this movie module has all the code for defining and validating a movie object (it knows what a movie should look like);

const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre"); // this is something new that I didnt do in customer and genre API that I did in previous sections!

// mongoose schema if for you to store in database, Joi schema is for validating user input!
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  // for line below, basically in models folder just connect genre to genreSchema, later on in routes folder, you can select the properties that you want from genreSchema!
  genre: {    // we already have a genre collection, but now we're embedding genre document inside movie document to optimize performance of queries, but we still need the genre collection on its own because somewhere in the application we might need the users to have drop down list of all genres so its much more easier if that data comes from genre collection rather than querying each movie document to get unique genre inside the movie documents;
    type: genreSchema, // the reason I loaded the genreSchema on top of this module!
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

// BASICALLY JOI SCHEMA IS WHAT THE CLIENT SENDS US >>>
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(), // here in Joi schema, theres a property called genreId, in mongoose schema above, the property is genre. THIS IS BECAUSE I WANT THE CLIENT TO SEND ONLY THE ID OF THE GENRE. TAKE NOTE OF objectId(), its the function i defined due to loading object-id package in index.js, now in movie.js and rental.js, i can check whether the value of genreId, movieId, or whateverId is a valid ObjectId thanks to joi-objectid package, JOI PACKAGE ON THE OTHER HAND ONLY VALIDATES WHETHER VALUE IS PRESENT IN THESE IDs!
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movie);
}

exports.Movie = Movie;
module.exports.validate = validateMovie;
