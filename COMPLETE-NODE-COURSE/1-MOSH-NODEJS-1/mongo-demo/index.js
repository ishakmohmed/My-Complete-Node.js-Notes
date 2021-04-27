// in real world, connection string (arg of .connect()) should come in configuration file, not hard coded like rn, basically different connection string in production environment >

const mongoose = require("mongoose");
// .connect() returns promise >
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// SCHEMA: used to define the shape of documents within a collection in MongoDB;
// note: schema is part of mongoose, not mongodb;

// Schema types >>>
// String
// Number
// Date
// Buffer    << for storing binary data
// Boolean
// ObjectID  << for assigning unique identifiers
// Array

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now }, // or just Date instead of this object;
  isPublished: Boolean,
});

// now needa compile schema into a model;

const Course = mongoose.model("Course", courseSchema); // returns Course class. arg1 is singular name of collection that this model is for, arg 2 is schema that defines shape of document in this collection;

// Now that I have a Course class, I can instantiate it, aka create a Course object;

// since I'm using await >
async function createCourse() {
  const course = new Course({
    // now I can create Course object based on Course class above;
    name: "Angular course",
    author: "Mosh",
    tags: ["Angular", "Frontend"], // not setting date (relying on default value)
    isPublished: true,
  });

  const result = await course.save(); // returns promise, so can await. THIS IS AN async operation (accessing file system), result of operation will be ready in future;
  console.log(result);
}

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

async function getCourses() {
  // Comparison query operators in MongoDBBBBBBBB >
  // eq, ne, gt, gte, lt, lte, in, nin

  // Logical query operators >
  // and, or

  const courses = await Course
    // note: theres find(), findById(), findOne(), findbyidandremove, findbyidandupdate, findoneandremove, findoneandupdate

    // .find({ author: "Mosh", isPublished: true }) // filter in find() in optional, if you dont pass any argument, all documents get returned. find() method returns document query object, can await, can .then();
    // .find({ price: { $gt: 10, $lte: 20 } }) // << both are applied;
    // .find({ price: { $in: [10, 15, 20] } })
    //-------------------------------------------------------------------

    // LOGICAL QUERY OPERATORS >>>

    // NOTE: IF YOU WANNA FIND AUTHOR: MOSH ORRRRR ISPUBLISHED: TRUE, YOU WANNA USE .FIND() WITH NO ARG AND THEN USE .OR();
    // .find()
    // .or([{ author: "Mosh" }, { isPublished: true }]) // pass an array of filters;
    // .and() works similar with .or(), in fact SOMETIMES you don't even need .and() because you can just place all your filters in .find() like in the second commented out line after "await Course", but maybe in complex queries you need .and();
    //--------------------------------------------------------------------

    // Regular expression >
    .find({ author: /^Mosh/ })
    // starts with > /^pattern/,
    //  ends with > /pattern$/,
    //  now with case insensitive (not sure if it works with starts with too,but i'm strongly sure yes)> /pattern$/i,
    //  contains something > /.*Mosh.*/i   << can use i if you want too;
    .limit(10)
    .sort({ name: 1 }) // sort 1 for ascending, -1 for descending. ORRRR .sort('name') for ascending and .sort('-name') for descending;
    // .select({ name: 1, tags: 1 }); // only wanna get name and tags.... OR, .select('name tags');     << uncomment this line when necessary and comment out the line below;
    .countDocuments(); // < instead of actual documents, you want the number of documents only;
  console.log(courses);
}

// createCourse();      <<< uncomment this out when necessary and comment below line;
getCourses();

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  (in above code i replace the old .count() to .countDocuments())
// (node:692) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
// (node:692) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.(node:692) DeprecationWarning: collection.count is deprecated, and will be removed in a future version. Use Collection.countDocuments or Collection.estimatedDocumentCount instead
// Connected to MongoDB...
// 2
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
