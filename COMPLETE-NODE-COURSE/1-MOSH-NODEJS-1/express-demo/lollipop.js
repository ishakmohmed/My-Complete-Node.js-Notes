const Joi = require("joi"); // but is Joi used in this module?
const genres = require("./lollipopRoutes/genres");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/genres", "genres");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
