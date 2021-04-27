const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
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
    type: new mongoose.Schema({
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
});

// THIS IS HOW YOU ADD A STATIC METHOD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    // "this" will reference the Rental class, obv don't use arrow fn!
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

// NOW ADDING AN INSTANCE METHOD INSTEAD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
rentalSchema.methods.return = function () {
  // when someone returns a movie, all the following things will get executed;
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days"); // I guess difference between whatever passed and rrriiiggghhttt now!
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;

  // I GUESS HERE YOU'RE NOT SAVING IT BECAUSE YOU CANT rental.save(), instead you needa this.save()???? Ohhh i get it, cause you didnt compile it to Rental class yet so you cant const rental = new Rental(), so if you cant even do that obviously you cant save!!!!!!!!!!!!!!
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
