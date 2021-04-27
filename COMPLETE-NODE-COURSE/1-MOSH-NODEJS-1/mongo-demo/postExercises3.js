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

// SOMETIMES YOU WANNA GET THE UPDATED DOCUMENT, SO USE findByIdAndUpdate >>>

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    id, // not { _id: id }
    {
      $set: {
        author: "JasonJasonJason",
        isPublished: false,
      },
    },
    { new: true } // if you don't pass { new: true}, you'll get document before updated, not the updated document;
  );

  console.log(course);
}

updateCourse("5f76c5716686e31448fd6cad");
