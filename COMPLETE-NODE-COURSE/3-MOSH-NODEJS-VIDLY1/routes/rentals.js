// note: ojlinttaskcollections collection in mongodb compass is created automatically by Fawn library in this case inside vidly database to perform two phase commits, in which this ojlint... collection represents transaction (which isnt available in mongodb), THEN IT WILL EXECUTE EACH OF THE OPERATIONS INDEPENDENTLY LIKE .save(), .update(), and finally after these operations complete, Fawn will delete this ojlinttaskcollections collection!

const Fawn = require("fawn"); // to implement kinda transaction (transaction doesnt exist in mongodb though), internally TWO PHASE COMMIT is implemented here (two phase commit is available in mongodb but beyond scope of course, so were using Fawn library to implement two phase commit)! BUT WAIT, NEEDA INITIALIZE FAWN LOOK 7 TO 8 LINES BELOW!
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose); // pass mongoose object here, Fawn class is on THE VERY top!

// IN THIS API YOU SHOULD BE ABLE TO CREATE A NEW RENTAL OR POST, AND GET THE LIST OF RENTAL WHICH IS GET;

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut"); // sorting by dateOut in descending;
  res.send(rentals);
});

router.post("/", async (req, res) => {
  // NOTE: >>>>>>>>     ************     REQ.BODY IS JOI SCHEMA!!!!!!!!!!!!!

  const { error } = validate(req.body); // note to myself: validate here is Joi Schema (input sent by client)!
  if (error) return res.status(400).send(error.details[0].message); // in Joi error, you do error.details[0].message because Joi has hella lot of error messages so im just picking the first element in details and getting that message. If only the error doesnt come from Joi validation where i needa write the error message, id write something like "Invalid customer";

  // SUPER IMPORTANT: I THINK IM HIGHLY SURE THAT REQ.BODY IS JOI SCHEMA VALIDATION FUNCTION BASED ON MY OBSERVATION!

  // THIS IS IMPLEMENTED IN RENTAL.JS USING joi-objectid package, but here is the bad, manual way to do it, basically Joi checks whether customer id and whatever id is present but it doesnt check if its a valid object id (which if passed to Customer.findById(invalidObjId), POSTMAN will hang so you wont even get the error message), thats what im gonna do here but im gonna comment it out, because im gonna use joi-objectid package >>>
  // if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
  //   return res.status(400).send("I N V A L I D   OBJECTID");

  const customer = await Customer.findById(req.body.customerId); // TO CHECK IF THE CUSTOMER ID IS A VALID CUSTOMER. "customerId" here is DEFINED in Joi validation in rental.js, basically the client input!;
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    // obviously, needa import it!
    customer: {
      _id: customer._id, // I can access _id although i didnt define in schema because _id is something mongodb will automatically assign for every schema!
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate, // not setting dateOut because I'm relying on default value, so when i rental.save() 4 to 5 lines below, mongoose will automatically set this property;
    },
  });
  // T H E S E  three  L I N E S  ARE COMMENTED OUT BECAUSE NOW IM USING FAWN TO SIMULATE TRANSACTION >>> >>> >>> >>> >>>    >>> > >> >>>>>>    >  >     >>>>> >
  // rental = await rental.save();

  // movie.numberInStock--; // after save() above this line, save() below this line might not get exuted for whatever reason, which is why we need transaction, which is not available in nodejs but we can kinda implement it (not really) using npm package, internally it will use TWO PHASE COMMIT [beyond course scope, check chrome bookmark to learn more]. THAT LIBRARY IS FAWN;
  // movie.save(); // save() the movie now, not the rental!

  try {
    // try-catch: if something fails during this "kinda transaction", which is two phase commits internally!;

    // note: in recap pdf, mosh wrote await new Fawn.Task(), in the next line there is no await, so yeahhhhhhhhhhhhhhhhhhhhhhhh, ccraaaazyyyy!!!

    new Fawn.Task() // all these operations will be treated as a unit, either get successfully executed together or not, if some gets successfully executed first and the others arent in the same unit, the operations of the successful ones will be rolled back!
      .save("rentals", rental) // arg1: rental collection, arg2: rental obj i created
      .update(
        "movies",
        { _id: movie._id }, // ishakQF: since its Fawn, and were save()ing rental in fawn, I can access movie right away because its inside rental when i created it up there!
        {
          $inc: { numberInStock: -1 },
        }
      )
      // .remove()     // theres also remove() in Fawn to remove a document, READ MORE IN DOCUMENTATION -> BOOKMARKED ON CHROME;
      .run(); // finally, fawn needs me to call run after all operations chaining so all the operations above will be run!

    res.send(rental); // now part of Fawn but placing it in try block for obvious reasons!
  } catch (ex) {
    // at this point, all operations are automatically rolled back!
    res.status(500).send("Something failed."); // 500 error means internal server error;
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
