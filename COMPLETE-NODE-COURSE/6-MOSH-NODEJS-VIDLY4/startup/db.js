const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("Connected to MongoDB..."));
  // .catch((err) => console.error("Ishak, could not connect to MongoDB...")); <<< deleted this because we're not doing anything, just logging message on console that mongodb is connected, we're not even terminating the process! I guess the thing is that I already have an error handler;
};