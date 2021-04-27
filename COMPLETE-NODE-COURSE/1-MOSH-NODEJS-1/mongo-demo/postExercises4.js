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

async function removeCourse(id) {
  // if pass generic stuffs to deleteOne() which would return a lot of document, only the first one would get deleted;
  const result = await Course.deleteOne({
    _id: id,
  }); // theres also deleteMany();
  // if you wanna delete and get the deleted document too, you can use findByIdAndRemove()
  // const course = await Course.findByIdAndRemove(id); << uncomment this line, comment line above!
  console.log(result); // { n: 1, ok: 1, deletedCount: 1 }
}

removeCourse("5f76c5716686e31448fd6cad");
