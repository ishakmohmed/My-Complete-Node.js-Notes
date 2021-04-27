const Joi = require("joi");
const validateRequest = require("../middleware/validateRequest");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validateRequest(validate)], async (req, res) => {
  // .find() returns array, .findOne() doesn't!

  // **************************************************************
  // CODE BELOW IS COMMENTED OUT BECAUSE IT IS REPLACE WITH BETTER IMPLEMENTATION WHICH IS BY ADDING A STATIC METHOD TO RENTAL SCHEMA;

  // const rental = await Rental.findOne({
  //   // ohh this is how you find obj with multiple unique reference which you cant do in findById(), you .findOne() which has different ids, or just find() but pass similar query like in here with multiple properties and for each property, you > req.body.customerId. If you dont understand this line, thats okay cause my explanation here isnt very good in this case but just make sure you understand this code block!
  //   "customer._id": req.body.customerId, // OMG- instead of "customer": value, YOU'RE GOING 1 LEVEL DOWN RIGHT AWAY IN THE KEY, so "customer._id"!!!
  //   "movie._id": req.body.movieId,
  // });

  // SO HERE IS THE BETTER, REPLACED IMPLEMENTATION >>>>>>>>>>>>>>

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId); // lookup() is a static method in Rental class!
  if (!rental) return res.status(404).send("Rental not found.");

  // **************************************************************

  // if you get to this point that means theres a rental!

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.return(); // this is a refactored instance method in rental object, so itll set the dateReturned, calculate difference between dateOut and dateReturned/right now, and calculate the rental fee;
  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      // when you update plzzz await the promise so you update the database first before returning a response, otherwise it might give you errors left and right!
      $inc: { numberInStock: 1 },
    }
  );

  // ACTUALLY, YOU DONT NEEDA EXPLICITLY SEND 200, BECAUSE EXPRESS WILL SET THAT BY DEFAULT;
  // return res.status(200).send(rental); // IN OTHER CASES ALTHOUGH YOU DON'T WANNA SEND ANY MESSAGE, NEEDA CALL .SEND() otherwise you're not gonna send response back to the client!

  // SO HERE IS THE SIMPLER IMPLEMENTATION THAN THE LINE ABOVE WHICH EXPLICITLY SENDS STATUS CODE 200 >>>
  return res.send(rental); // basically keep .send(rental) and remove .status(200) in the middle completely because that's the default value anyway;
});

function validate(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
