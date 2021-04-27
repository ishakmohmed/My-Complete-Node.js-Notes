// // HTTP Module >>>
// const http = require("http");
// const server = http.createServer(); // this "server" is an EventEmitter (has on(), addListener(), emit(), etc cause http.Server inherits from net.Server which is an EventEmitter);

// server.on("connection", (socket) => {
//   console.log("New connection...");
// }); // name of event is connection, which you can find in DOCUMENTATION, don't memorize!

// server.listen(3000);
// console.log("Listening on port 3000...");

// more real-world example of ^ (pass callback fn to createServer()) >

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Hello, world!");
    res.end();
  }

  if (req.url === "/api/courses") {
    res.write(JSON.stringify([1, 2, 3]));
    res.end();
  }
});

server.listen(3000);
console.log("Listening on port 3000...");

// actual real world: use Express.js to handle various routes much better (expressJS is built on top of HTTP module);
