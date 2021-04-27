const winston = require("winston");
const express = require("express");
const app = express(); // there should only be 1 app, in the index!

require("./startup/logging"); // this line comes first than the 2 lines below for obvious reasons!
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`)); 

