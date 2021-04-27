// basically now you can just validate object id using >>> mongoose.Types.ObjectID.isValid(id), but now we are not using manual validation, we're using Joi. The problem is Joi cannot valdiate is a value is ObjectId or not, so Joi has a friend called joi-objectid, with this you can use the function that is returned, in this case i named it objectId (just use this name to be safe) SO THAT I CAN MAKE JOI MORE POWERFUL such that it can validate ObjectId thanks to his friend!

// these 2 lines below can just be places in rental.js but now I extracted it out to refactor the codes because not rental only is using joi-objectid package to valdiate ObjectId if its a valid ObjectId or not, but in rental.js these 2 lines are present (commented out) with the notes so that you can read the notes if you forget after 25 years!

// now you can use objectId() fn inside Joi schema such as in validateCustomer(), validateGenre(), etc. to check whether a value is proper ObjectId or not!
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// - ----------------------------
const mongoose = require("mongoose"); // step 1
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Ishak, connected to MongoDB..."))
  .catch((err) => console.error("Ishak, could not connect to MongoDB...")); // Step 2

app.use(express.json());
app.use("/api/genres", genres); // just so that i recall: now i can replace /api/genres in genres api to / only;
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
