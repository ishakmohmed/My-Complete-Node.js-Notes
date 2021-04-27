const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true, // <<<< new knowledge
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, // <<< make it high because needa hash password!
  },

  isAdmin: Boolean,
  // roles: [] // instead of isAdmin (admin or not admin, which are 2 options), you might wanna have more roles, so array of string, or array of complex objects or something like that!
  // operations: [array of complex objects]  // or operations!
});

// now I wanna add a method in this schema (ENCAPSULATION LOGIC IN MONGOOSE MODELS) >>>
// .methods returns an object, and then you can set key-value pairs!
userSchema.methods.generateAuthToken = function () {
  // dont use arrow function, cause arrow functions dont have their own this, INSTEAD "THIS" in arrow functions references calling function, TYPICALLY we use arrow function for standalone functions, so if you wanna create a method that is part of object like user object, just use normal fn syntax !
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey")); // pass payload (all the public properties that you want on jwt) as arg, which can be a simple string or an object. 2ND ARG IS PRIVATE KEY WHICH WILL BE USED TO CREATE SIGNATURE (dont hardcode it), THE PRIVATE KEY WILL BE STORED ON THE SERVER!;
  return token;
};

// ^^^ now the user object will have a method called generateAuthToken() ^^^

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(), // need to call email method to ensure its a valid email!
    password: Joi.string().min(5).max(255).required(), // password is 255 not too high unlike schema because this is plaintext before hashing which will be a longer string!
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
