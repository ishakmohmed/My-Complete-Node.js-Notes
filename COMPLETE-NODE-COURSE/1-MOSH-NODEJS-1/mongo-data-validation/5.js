const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Validation Errors >>>

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
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: "A course should have at least 1 tag!",
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
    category: "-", // <<<<<<< wrong input 1/2 so i can experiment
    author: "Mosh",
    tags: null, // <<<<<< wrong input 2/2 to experiment
    isPublished: true,
    price: 15,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    // iterating over validation errorsss object;
    for (let field in ex.errors) console.log(ex.errors[field].message); // now I can see the error message from 2 of my error causes. If i remove "message" in this line, a detailed error details will be given honestly i dont wanna write it because it brings too much complexity;
  }
}

createCourse();
