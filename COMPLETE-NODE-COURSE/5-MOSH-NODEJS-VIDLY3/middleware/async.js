// ALL THE CODES BELOW ARE REPLACED WITH A BETTER IMPLEMENTATION, AND THAT IS TO USE THE EXPRESS-ASYNC-ERRORS PACKAGE AND TO SIMPLY LOAD THAT PACKAGE IN INDEX.JS WITHOUT STORING RESULT IN CONSTANT!

// module.exports = function (handler) {
//   // handler is the async fn in http route handlers!
//   return async (req, res, next) => {
//     // <<< returning a standard express route handler;
//     // returning a new route handler function, so that the req, res, and next objects can be accessed. I know you don't understand every little details about this concept, but just remember that if you wanna implement this feature, which you will in every node project, this is probably the only way to do so!
//     try {
//       await handler(req, res);
//     } catch (ex) {
//       next(ex);
//     }
//   };
// };

// NOTE ^^^ IF ONLY ABOVE CODE IS IMPLEMENTED, ALL ROUTE HANDLERS IN HTTP GET, POST, DELETE, PUT WILL BE WRAPPED WITH THIS FUNCTION like router.get("/", asyncMiddleware(ACTUAL ROUTE HANDLER GOES HERE))
