const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Built-in validators >>>

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // <<< these are all the built-in validators (required, minlength,etc)
    minlength: 5, // << minlength and maxlength for Strings
    // match: /pattern/,                <<<<<<<<<<<< R - E - M - E - M - B - E - R
    maxlength: 255,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"], // <<< built-in validator for STRING - array of valid strings;
  },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      // set required to boolean or fn that returns boolean;
      return this.isPublished; // don't use arrow function because there is a fn in mongoose thats gonna call this arrow fn (and you know how arrow functions inherit the "this" value), so it cannot access isPublished;
    },
    min: 10, // min and max built-in validator for Numbers (ALSO PRESENT FOR DATES)
    max: 200,
  },
});

const Course = mongoose.model("courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular course",
    category: "network",
    author: "Mosh",
    tags: ["Angular", "Frontend"],
    isPublished: true,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();
