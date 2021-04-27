const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  tags: [String],
  date: Date,
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("courses", courseSchema);

// 2 ways to update documents >
// - query first (findById(), modify its properties, save())
// - update first (update directly, optionally get the updated document as well)

// query first >>>

async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;

  course.isPublished = true;
  course.author = "Another Author";

  // Alternatively, you can set like this >

  // course.set({
  //   isPublished: true,
  //   author: 'Another Author'
  // });

  const result = await course.save();
  console.log(result);
}

updateCourse("5f8086489a89f029c0aeac0e"); // objectid is not string but here im passing as string;
