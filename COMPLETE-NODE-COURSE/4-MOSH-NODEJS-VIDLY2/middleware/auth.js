// SO THAT ONLY AUTHORIZED PEOPLE CAN DO STUFFS >>>

// NOTE: INSTEAD OF placing this in app.use... in index.js which will apply this middleware to all routes WHICH IS COOL AND IT WILL EXECUTED BEFORE EVERY ROUTER HANDLER, BUT NOT A GOOD IDEA CAUSE NOT ALL API ENDPOINTS SHOULD BE PROTECTED, instead pass this middleware as 2nd argument (middle argument) out of 3 arguments in route handlers that will modify data!

// as 2ND, MIDDLE PARAMETER OF every HTTP POST (at least for now), i'm gonna do call this middleware fn, SO THAT ONLY AUTHORIZED USER CAN ACCESS IT >

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // first usage of this auth middleware is in genres.js POST!!!
  // I KINDA believe that req.header(), in which req is user object (btw x-auth-token comes from a newly registered user), because only a user can call any endpoints!
  const token = req.header("x-auth-token"); // we expect a json web token stored in this header cause a user will get jwt in res.header() whether he logs in or registers as new user;
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); // .verify() will verify jwt, if its valid, itll decode it using jwtPrivateKey and return payload, BUT IF ITS NOT VALID IT WILL THROW AN EXCEPTION!
    req.user = decoded; // in request object, add user property- set to decoded. BASICALLY decoded here is _id: someId, and also isAdmin: this.isAdmin that we set in jwt.sign() in user.js!!!

    // ^ I guess when you get the payload, you dont next() right away, instead you make an object or something and place the payload inside it, but make sure you create this object like user inside req, so itll be req.user = payload/decoded!
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
