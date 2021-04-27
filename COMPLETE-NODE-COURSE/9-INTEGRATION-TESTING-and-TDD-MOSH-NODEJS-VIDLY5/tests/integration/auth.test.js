// testing the authorization middleware, if project is large, you wanna breakdown integration folder to middleware, routes, etc.

const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");

describe("auth middleware", () => {
  let server; // before this, in this comment i wrote that there should only be 1 server in tests, BUT I WAS WRONG!!!!!, you need separate server declaration in separate integration test files!!!
  let token;

  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  const exec = () => {
    // to test auth mw, needa send request to genres or other endpoints;
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token) // when you call the set method, whatever you pass here will be converted to string, so if you pass null, itll be converted to string in actual http request!
      .send({ name: "genre1" }); // not awaiting here before request(server)... cause you can simply return the promise because there is only 1 stuff over here, not multiple codes/operations and down there when you call this method you can await it.
  };

  // you can also add more than 1 beforeEach function like Mosh did but im not doing that because i find that 1 before each in this case is much more cleaner;

  it("should return 401 if no token is provided", async () => {
    token = ""; // you should use empty string not null cause null will be converted to string when you call the set method up there, so itll be 400 bad request just as implemented in auth middleware, basically to check if no token is provided, set the token to empty string because thats the onyl way, then all good!
    const res = await exec(); // not awaiting in happy path up there cause i dont need to in this case, rather i returned the promise up there by simply > return request(server)... and awaiting here;
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    // happy path, but you cant check in supertest if req.user is populated with payload of jwt just like in try bllock in auth middleware, but in supertest library, you don't have access to req like in req.user, you can only work with the response so you needa unit test it!
    const res = await exec();
    expect(res.status).toBe(200); // from the genre endpoint not the authorization middleware itself;
  });
});
