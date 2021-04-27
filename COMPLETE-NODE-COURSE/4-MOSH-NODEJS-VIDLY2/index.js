const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users"); // <<< added this (obv)
const auth = require("./routes/auth"); // << and this
const express = require("express");
const app = express();

// basically if this jwtPrivateKey is not set, its gonna bring too much of issue- OUR AUTHENTICATION ENDPOINT WILL NOT FUNCTION PROPERLY, so just dont even start this service. I GUESS JUST DO THIS EVERYTIME YOU MAKE A NODE PROJECT;
if (!config.get("jwtPrivateKey")) {
  // REMEMBER THAT THIS THING EXISTS AND YOU NEED IT BEFORE > mongoose.connect()...;
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1); // to exit the process, needa use the global process object in node, 0 means success, other number means failure usually 1
}

mongoose
  .connect("mongodb://localhost:27017/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Ishak, connected to MongoDB..."))
  .catch((err) => console.error("Ishak, could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users); // added this (obv)
app.use("/api/auth", auth); // and this

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
