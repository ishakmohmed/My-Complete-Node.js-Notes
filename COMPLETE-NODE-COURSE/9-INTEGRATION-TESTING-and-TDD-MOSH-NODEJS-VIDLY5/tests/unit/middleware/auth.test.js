// since in integration test i could only check the happy path based on the response number like 200 and not if the req.user is actually populated with the payload because you cant do that in supertest package, so i needa unit test that!
const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose"); // loading this to generate valid ObjectId;

describe("auth middleware", () => {
  it("should populate the req.user with the payload of a valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    }; // remember toHexString()? to recap when you save to db, mongoose saves as objectid, but when you read it or when you .toMatchObject() in expectation, the ObjectId will be converted to string, so its better to convert it to string first before storing in db when you are making unit or integration test, but in real implementation youre gonna wanna store thre actual objectid;
    const token = new User(user).generateAuthToken();
    const req = {
      // mocking out the req object to look and behave like the actual request object in the authorization middleware;
      header: jest.fn().mockReturnValue(token),
    };

    // i guess for below, if youre not using the obj at all like res, you make it an empty object, but if you are using it but its useless or you dont wanna test it, just mock it and dont do anything else like jest.fn();!
    const res = {}; // were not working with it in happy path but still needa pass as arg so its empty!
    const next = jest.fn(); // working with it in happy path, so its not empty, and you def needa mock it!

    auth(req, res, next); // now i need to mock these three objects;
    expect(req.user).toMatchObject(user);
  });
});
