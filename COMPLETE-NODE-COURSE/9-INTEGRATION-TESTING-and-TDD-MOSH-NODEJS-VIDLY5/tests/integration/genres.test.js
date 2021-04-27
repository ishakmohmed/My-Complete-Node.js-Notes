// problem with loading server object that you exported from index.js the usual way. When you run integration test, for the first time itll work, server will listen on port 3000 but if you make some changes jest is gonna rerun the test, so itll obv re-load the server again but youll get exception because there is server already running. So, when writing integration tests, you should load the server before and close it after each integration test.

const mongoose = require("mongoose");
const request = require("supertest"); // in integration test, you need jest + supertest!
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user"); // to generate auth token so that you can make some kinda genre http request!

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    // beforeEach() and afterEach() is a utility function in jest;
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({}); // pass an empty object, this will remove all documents in genres collection- the ones that you added on this test to be exact!
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres); // needa clean up this fake data after assertion in afterEach() function so even if assertion fail afterEach() function will get executed!

      const res = await request(server).get("/api/genres"); // get, post, put or delete!

      expect(res.status).toBe(200); // btw, "body" in two assertions below is an array!
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    // note: mongoose stores document with specific ObjectId, but when you read that object from database, the id will be a string!
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200); // for line below, im not gonna use toMatchObject cause look at note: mongoose stores... in this describe block >>>
      expect(res.body).toHaveProperty("name", genre.name);
      // I guess for above line, res.body is not an array because you're dealing with a single file ?????????
    });

    it("should return 404 if invalid id (ObjectId) is passed", async () => {
      // you dont needa add data to db cause you want this process to fail which will make this test pass!
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with given id exists", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  // describe("POST /", () => {
  //   it("should return 401 if client is not logged in (no token provided)", async () => {
  //     const res = await request(server)
  //       .post("/api/genres")
  //       .send({ name: "genre1" }); // you can also .send() in Jest basically this is body of request!

  //     expect(res.status).toBe(401);
  //   });

  //   it("should return 400 if genre is less than 5 characters", async () => {
  //     const token = new User().generateAuthToken(); // needa login before you post!

  //     const res = await request(server)
  //       .post("/api/genres")
  //       .set("x-auth-token", token) // this is the key that authorization middleware in genre POST looks for
  //       .send({ name: "1234" });

  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 if genre is more than 50 characters", async () => {
  //     const token = new User().generateAuthToken();

  //     const name = new Array(52).join("a"); // to get 51 characters!

  //     const res = await request(server)
  //       .post("/api/genres")
  //       .set("x-auth-token", token)
  //       .send({ name: name });

  //     expect(res.status).toBe(400);
  //   });

  //   it("should SAVE the genre if it is valid", async () => {
  //     const token = new User().generateAuthToken();

  //     const res = await request(server)
  //       .post("/api/genres")
  //       .set("x-auth-token", token)
  //       .send({ name: "genre1" });

  //     const genre = await Genre.find({ name: "genre1" });
  //     expect(genre).not.toBeNull();
  //   });

  //   it("should RETURN the genre if it is valid", async () => {
  //     const token = new User().generateAuthToken();

  //     const res = await request(server)
  //       .post("/api/genres")
  //       .set("x-auth-token", token)
  //       .send({ name: "genre1" });

  //     expect(res.body).toHaveProperty("_id"); // you don't care about value so not passing 2nd argument1
  //     expect(res.body).toHaveProperty("name", "genre1");
  //   });
  // });

  // ***********************************************************************
  // ***********************************************************************
  // ***********************************************************************

  // IM GONNA REFACTOR THE TEST ABOVE FOR HTTP POST USING MOSH'S OWN REFACTORING TECHNIQUE >>>>>>>

  // ***********************************************************************
  // ***********************************************************************
  // ***********************************************************************

  describe("POST /", () => {
    // Define the happy path, and then in each test, we change one parameter that clearly aligns with the name of the test.
    let token;
    let name;

    // Happy path >
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name }); // initially name was hardcoded, but now name: name and default name is in before each!
    };

    beforeEach(() => {
      // set values for happy path!
      token = new User().generateAuthToken();
      name = "genre1";
    });

    // just write 1 test for authorization middleware cause you have a separate file for testing it since it is used in different parts of the application, so for this endpoint just write 1 test to make sure it is included / implemented correctly in this endpoint;
    it("should return 401 if client is not logged in (no token provided)", async () => {
      token = ""; // this line will override value in exec() below only for the token;
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234"; // clearly aligns with the description;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should SAVE the genre if it is valid", async () => {
      // this is the happy path so not resetting any values!
      await exec(); // in this line im not using value returned from exec() so not getting value;
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should RETURN the genre if it is valid", async () => {
      // this is also the happy path, so not resetting any values cause its refactored up there in this suite!
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************
  // *****************************************************************************

  // MOSH'S ANSWER FOR PUT AND DELETE (I DIDNT CODE IT) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      // this beforeEach() is only for describe(PUT) not this entire genre endpoint, which is why theres no afterEach() because you dont need it and cause its in the entire genre endpoint where it removes from genre after each test!
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: "genre1" });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      newName = "updatedName";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token);
      // .send();   // <<< I commented this out from Mosh and it works!
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
