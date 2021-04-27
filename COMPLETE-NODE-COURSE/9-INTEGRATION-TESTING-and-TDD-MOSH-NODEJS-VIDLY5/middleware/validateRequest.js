module.exports = (validator) => {
  // since each route handler has different validators (Joi), you wanna dynamically pass the validator in this middleware, but ofc all middleware must have req, res, next so inside this function, you return a function with req, res, next, inside this function because ALL MIDDLEWARE MUSTTTT have req, res, next!!!!
  return (req, res, next) => {
    const { error } = validator(req.body); // validator here is the dynamic Joi validator for different route handlers, other than that all route handlers that needa validate request body share the same code like in this line to the left of equal sign and line below!
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
