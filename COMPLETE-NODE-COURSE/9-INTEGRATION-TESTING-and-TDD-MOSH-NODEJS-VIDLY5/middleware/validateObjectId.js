const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    // adding this (INITIALLY AT THE VERY TOP OF HTTP GET/:ID OF GENRES.JS) cause in my integration test im gonna add the invalid id as a parameter WHICH MEANS IF INVALID ID, JOI IS NOT GONNA CATCH IT BECAUSE JEST IN THIS CASE IS GONNA SEND id as parameter, NOT FROM BODY OF REQUEST WHICH JOI WILL CATCH, so without this if statement the express special error middleware will get executed which will return 500 which i dont want to assert in test, rather i want to assert 404 if id is invalid as if youre saying right away that resource not found although your id is invalid, basically being savage!!!
    return res.status(404).send("Invalid ID");

  next();
};
