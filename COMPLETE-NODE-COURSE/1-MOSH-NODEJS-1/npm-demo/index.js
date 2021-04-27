var _ = require("underscore"); // require() thinks its 1- core module, or 2- file/folder, or 3- node_modules;
console.log(_.contains([1, 2, 3], 2));