const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet()); // this is the fn that we needa call in order to get a middleware function;
  app.use(compression());
};
