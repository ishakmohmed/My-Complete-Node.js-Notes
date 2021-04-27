module.exports = function (req, res, next) {
  // were assuming that this middleware function will be executed after the auth (authorization) middleware function!

  // auth middleware function sets req.user, basically, in req, it creates a user (and sets that user object to payload or decoded variable in this case), so i can access it here!
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  next();
};
