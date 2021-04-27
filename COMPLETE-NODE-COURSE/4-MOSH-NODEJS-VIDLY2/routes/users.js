// registering a new user >>>
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// route handler to get current user, a more secure way instead of /:id >
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); // req.user means newly created property named user in auth middleware, and _id here is from decoded in auth middleware!

  // ^^^ note that req.user ^ generated originally from the json web token, BUT NOT THIS METHOD GOT IT FROM THE AUTH MIDDLEWARE WHICH SET req to req.user = decoded (added user object to req and then placed decoded/payload inside)!
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }); // in user.js, i set email to be unique. findOne() -> you can find one based on one or more properties, DONT USE findById, just use findOne();
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // now needa hash the password >
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // basically what im doing is that, in vidly application, when someone registers, they needa be logged in right away (cause vidly is used by workers in DVD store), which is why im sending back the jwt!

  // before sending the token to the client, obviously needa generate a token first!
  const token = user.generateAuthToken();

  // basically im sending the jwt back in response header, note that you should start ANY CUSTOM HEADER with x- and then arbitrary name like auth-token, 2nd arg is value, in this case token!
  res
    .header("x-auth-token", token) // you can also check this in POSTMAN, now when you create a new user, what he will get back is json web token in header of response NAMED x-auth-token!!!!!!!
    .send(_.pick(user, ["_id", "name", "email"])); // basically im using lodash here for simplicity, and i wanna send all properties except password back IN BODY OF REQUEST not HEADER LIKE x-auth-token above;
});

module.exports = router;
