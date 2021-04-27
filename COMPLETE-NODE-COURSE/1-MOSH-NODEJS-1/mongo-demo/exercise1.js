const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Ishak, MongoDB is connected ;)"))
  .catch((err) => console.error("Ishak, could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

// when we decorate a fn with async, js engine automatically wraps the result in a promise, so in below line > awaittttttttt getCourses();

async function run() {
  const courses = await getCourses(); // I guess if you wanna call an async function which returns a result, then await it!
  console.log(courses);
}

run(); // I guess now youre not awaiting this async function because its not returning any result;
