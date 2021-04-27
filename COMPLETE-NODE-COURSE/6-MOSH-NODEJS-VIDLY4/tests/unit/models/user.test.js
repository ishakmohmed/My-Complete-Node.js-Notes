// A test suite- describe() is a container for multiple tests or specs!

const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    // informal: in user.js model, theres a schema to store in db, theres a schema from client/Joi, but there are no rules on which properties I should set (required), so I'm just gonna set required properties for this test;

    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(), // cause when jwt verifies down there the ObjectId thatll get returned will be in form of string because it was stored as string in the first place due to generateAuthToken fn which has jwt.sign() inside it!
      isAdmin: true,
    };

    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); // in this case, the private key is 1234!

    expect(decoded).toMatchObject(payload);
  });
});
