// SINGLE RESPONSIBILITY PRINCIPLE: this genre module has all the code for defining and validating a genre object (it knows what a genre should look like);

const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  // step 4
  name: {
    // <<< SchemaType object;
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema); // Step 5 (or instead of genreSchema, pass the actual schema instead, so you dont have to create mongoose.Schema() first, rather model it right away), SO YOULL DO SOMETHING LIKE mongoose.model("Genre", new mongoose.Schema({}));

function validateGenre(genre) {
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;