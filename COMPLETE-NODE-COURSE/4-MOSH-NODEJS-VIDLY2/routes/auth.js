// authenticating users who are obviously already registered >>>

const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user"); // here, i removed validate function in this curly braces because that function is used to validate new user (name, email, password, and 50 other properties), but now i wanna validate ONLY email and password. THIS MEANS I HAVE TO WRITE MY OWN VALIDATE FUNCTON IN THIS MODULE;
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body); // a simplified validate i defined at the bottom of this module because i only want to validate email and password, THIS IS SOMETHING TO REMEMBER WHEN YOU WANNA PERFORM AUTHENTICATION!
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password"); // send vague response, like invalid email or password, i guess thats the tradition!

  const validPassword = await bcrypt.compare(req.body.password, user.password); // this method is used to compare plaintext password with a hashed password. AS YOU GOT TO KNOW IN HASH.JS, the hashed password (2nd arg here) has salt included in it (in my observation prefixed, but it could be postfixed too). Now that bcrpt is comparing these 2 stuffs, it will take the salt from 2nd arg, and rehash the first arg WHICH IS A PLAINTEXT PASSWORD to a hashed password, and compare these 2 arguments whether they're the same;

  if (!validPassword) return res.status(400).send("Invalid email or password."); // send vague response again!

  // jwt is basically a long string, pretty much like your driver's license or passport!
  // on the CLIENT like web application or mobile application, we need to store jwt to send back to server for future API calls!
  const token = user.generateAuthToken(); 
  res.send(token); // basically this is the body of the response!
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
