// AFTER
// ALL
// THOSE
// ADVANCED
// CODES
// I IMPLEMENTED IN MOSH NODEJS 2 WHICH IS VIDLY APPLICATION,
// IM COMING BACK TO
// MOSH NODEJS 3

// ________________________________________

// ObjectID, almost unique but not 100% unique

// _id: 5f8dad1ddedead2ca0f475ac
// - 24 character,
// - each 2 char is a byte,
// - total 12 byte
// - first 4 bytes is a timestamp
// - next 3 bytes is a machine identifier
// - next 2 bytes is a process identifier
// - last 3 bytes is a counter

// 1 byte = 8 bits, 2^8 = 256
// 3 byte = 24 bits, 2^24 = 16 million numbers!

// how 2 documents might have same ObjectID(very unlikely)?
// in the same machine, same process, same timestamp, if more than 16 million ObjectIds are created, the counter will overflow, but very less chance!

// -----------------------------

// MongoDB driver talks to MongoDB, in which the driver creates this almost unique ObjectId, that means we dont have to wait for mongodb to generate new unique identifiers, making mongodb highly scalable! THIS MEANS BEFORE YOU EVEN SAVE A MOVIE like await movie.save(), MONGOOSE ALREADY CREATED AN OBJECTID FOR YOU... Mongoose will talk to mongodb driver to generate new ID, or you can explicitly generate an ID if you want to >>>

const mongoose = require("mongoose");
const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());

console.log(mongoose.Types.ObjectId.isValid('1234')); // will log false because the string "1234" is not a valid ObjectId!