const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Custom validators >>>

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
  },
  author: String,
  // if tags: [String], I can just pass an empty array and mongoose would allow me, so need custom validation >>>

  // C U S T O M  V A L I D A T I O N > > > > > > > > >>>>>>>>>>>>

  tags: {
    type: Array, // so mongoose will initialize tags to empty array;
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A course should have at least 1 tag!", // < custom message is optional;
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
  },
});

const Course = mongoose.model("courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular course",
    category: "network",
    author: "Mosh",
    tags: [],
    isPublished: true,
    price: 15,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();
