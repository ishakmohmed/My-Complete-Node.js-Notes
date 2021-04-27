const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

// async function createCourse() {
//   const course = new Course({
//     name: "Angular course",
//     author: "Mosh",
//     tags: ["Angular", "Frontend"],
//     isPublished: true,
//   });

//   const result = await course.save();
//   console.log(result);
// }

async function getCourses() {
  // BASICALLY IN THIS FILE I WANNA IMPLEMENT PAGINATION >
  const pageNumber = 2;
  const pageSize = 10;
  // in real world, it'll be something like > /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "Mosh", isPublished: true })
  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    .skip((pageNumber - 1) * pageSize) // goes hand-in-hand with limit(), used for PAGINATION. IN THIS LINE IM SKIPPING ALL DOCUMENTS IN PREVIOUS PAGE;
    .limit(pageSize) // < NOW, LIMIT(PAGESIZE);
    // ^ with these 2, we can get documents in a given page.
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
