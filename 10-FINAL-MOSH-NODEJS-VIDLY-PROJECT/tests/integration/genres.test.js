const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user"); 

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({}); 
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres); 

      const res = await request(server).get("/api/genres"); 

      expect(res.status).toBe(200); 
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200); 
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id (ObjectId) is passed", async () => {
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

    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name }); 
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in (no token provided)", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234"; 
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should SAVE the genre if it is valid", async () => {
      await exec(); 

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should RETURN the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

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
    };

    beforeEach(async () => {
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
