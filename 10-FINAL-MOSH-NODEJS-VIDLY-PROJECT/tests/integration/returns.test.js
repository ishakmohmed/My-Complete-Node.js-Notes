// TEST-DRIVEN DEVELOPMENT >>>

// POST /api/returns {customerId, movieId}, this endpoint- to return borrowed movie!

// NOTE: in this file, you assume there is a rental with a date so when you post to returns endpoint that means you wanna end that rental set the final date, calculate the day borrowed and the rental fee and finish things once and for all;

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server; 
let customerId;
let movieId;
let rental;
let movie;
let token;

const exec = () => {
  return request(server)
    .post("/api/returns")
    .set("x-auth-token", token)
    .send({ customerId, movieId });
};

describe("/api/returns", () => {
  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: {
        name: "12345",
      },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId, 
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie combination", async () => {
    await Rental.remove({}); 

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save(); 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate (dateReturned) if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned; 

    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the rental fee (number of days * movie.dailyRentalRate) if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
