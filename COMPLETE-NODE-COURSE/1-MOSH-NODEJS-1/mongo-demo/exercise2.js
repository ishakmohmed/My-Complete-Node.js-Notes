const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Ishak, connected to MongoDB"))
  .catch((err) => console.error("Ishak, could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  return await Course.find({
    isPublished: true,
    tags: { $in: ["frontend", "backend"] }, // if you write > tags: ["frontend", "backend"], that means you want course with both frontend and backend course;
  })
    .sort("-price")
    .select("name author price");
}

// another way to get frontend or backend tag without using in operator >>>
// async function getCourses() {
//   return await Course.find({ isPublished: true })   // < now I get it, if you wanna use .or(), theres no restriction to pass argument in .find(), its up to you;
//     .or([{ tags: "frontend" }, { tags: "backend" }])
//     .sort("-price")
//     .select("name author price");
// }

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
