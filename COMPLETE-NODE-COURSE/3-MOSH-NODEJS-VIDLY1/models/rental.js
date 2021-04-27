const Joi = require("joi");

// LINE BELOW (Joi.objectId = ...) is commented out because I MOVED IT TO INDEX.JS!!!!

// Joi.objectId = require('joi-objectid')(Joi); // Joi.objectId, objectId is a method in Joi object that I created. Basically, the result of require(...)(...) in this line is a fn so im placing it in Joi like Joi.objectId =. THIS LINE OF CODE IS USED TO VALIDATE OBJECT ID WHICH JOI PACKAGE DOESNT DO;
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      // note, informal but right, quick way to remember: if youre making a schema and you need a property just do it the usual way, but if you want a property in the schema but that specific property has its own schema module in the same folder and now you just want the absolute essential properties of that property, the use new mongoose.Schema({}) instead of treating it like a new property cause in schema you mostly define new properties!

      type: new mongoose.Schema({
        // type is a custom schema that i defined, in other words, im not using customer schema in the customer module, cause i just need primary, absolute essential customer properties when displaying the list of rentals
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },

    movie: {
      // my custom movie schema not movie schema in movie.js in model folder, BASICALLY FOR RENTAL DOCUMENT I JUST NEED TITLE OF MOVIE AND DAILY RENTAL RATE, the absolute essential;
      type: new mongoose.Schema({
        // use type: new mongoose.Schema... cause i just want the absolute essestial properties of movie in THIS RENTAL SCHEMA!!!!!!;;;;
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      // I guess now youre not using new mongoose.Schema... because this is a new property in rental, unlike movie above which has its own main schema in another module in model folder;
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) { 
  // basically when creating a new rental i just want the customer to send customerId and movieId, unlike in movie.js where there will be a whole lot more properties because when posting a movie to database it should be pretty complex.
  const schema = Joi.object({
    // these 2 properties are properties that client sends to server, no dateOut, dateReturned, etc because that should be set on the server!
    customerId: Joi.objectId().required(),  // objectId here is due to joi-objectid package to validate ObjectId, its a method I defined on top of this module to check whether the value of customerId passed is a valid ObjectId which Joi doesnt check but joi-objectid package does!;
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
