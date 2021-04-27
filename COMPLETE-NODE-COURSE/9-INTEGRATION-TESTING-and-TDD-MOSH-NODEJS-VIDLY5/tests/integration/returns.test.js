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

// _>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>

const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server; // you can also declare this in the suite;
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
    customerId = mongoose.Types.ObjectId(); // creating separate variable so its gonna be easier and simpler to access it in test;
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    // reason im creating a movie here is to check whether numberInStock which is only available in original movie database is incremented by 1 in one of the last tests, SO BASICALLY IM KINDA CREATING A RELATIONSHIP BETWEEN MOVIE IN RENTAL AND MOVIE IN MOVIE DATABASE;
    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: {
        // in movie.js, genre: genreSchema, so when you create a movie obj like here, this is how you should create it!
        name: "12345",
      },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId, // you wanna set the id here cause you wanna use it in test!
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

  // _>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>_>

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    // you wanna assume that user is already logged in but doesn't provide customerId;
    // to exclude customerId in payload, literally exclude it, don't > customerId ="", so it'll be .send({ movieId}) with missing customerId   BUT IN THIS CASE customerId="" because its not in payload rather you wanna override the payload in happy path that is defined up there using Mosh's technique;
    customerId = ""; // another approach instead of setting to empty string is to define a payload object and then here to override it you can use the delete keyword > delete payload.customerId

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie combination", async () => {
    await Rental.remove({}); // remove all rentals, otherwise the rental document might be present in db, which we don't want in this case!

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("return 400 if return is already processed", async () => {
    rental.dateReturned = new Date(); // dateOut has default value, dateReturned has no default value and it is not required either, so i needa set it!
    await rental.save(); // whenever you make a change, you needa save() it!

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate (dateReturned) if input is valid", async () => {
    const res = await exec();

    // to make assertion, needa get rental obj from db, and inspect its returned date property!

    const rentalInDb = await Rental.findById(rental._id);

    // Since you can't really test time in test and production code to match exactly the same, this is the way to go, which is to calculate difference >>>
    const diff = new Date() - rentalInDb.dateReturned; // to calc diff, below im assuming worst case scenario is 10 seconds, BTW DIFFERENCE IS IN MILLISECONDS. SO BTW OVER THERE IN ROUTE HANDLER YOU ALSO NEED TO SET new Date();

    expect(diff).toBeLessThan(10 * 1000); // in ms, means 10 seconds;
  });

  it("should calculate the rental fee (number of days * movie.dailyRentalRate) if input is valid", async () => {
    // reason i need momentJS in test here is because i dont want dateOut to be a couple of seconds ago, i want it to be a couple of days back!
    rental.dateOut = moment().add(-7, "days").toDate(); // set 7 days back from now, then convert moment object to plain JS object using .toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId); // testing obj from Movie, cause only Movie obj has numberInStock property!
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await exec(); // remember, if all good in route handler, after saving to db, it has been res.send(), yeah we're gonna test that!

    const rentalInDb = await Rental.findById(rental._id); // I guess I don't need this line anymore in this test due to better implementation;

    // !!!CANNOT make assertion like below line, because in rental db, date is stored as standard js datetime, but the object you get from res.body, its formatted in json so you get a string!
    // expect(res.body).toMatchObject(rentalInDb);

    // So what's the right way? Just check existance of properties!!!

    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    // expect(res.body).toHaveProperty("movie");

    // Hold on, there's a better way to do this >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    expect(Object.keys(res.body)).toEqual(
      // to use toEqual(), arg in expect() must be array!;
      expect.arrayContaining([
        // the arrangement of keys in this array doesn't matter!
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
