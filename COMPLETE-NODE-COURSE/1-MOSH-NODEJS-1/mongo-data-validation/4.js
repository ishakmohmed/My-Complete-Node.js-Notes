const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Async validators (sometimes the validation logic may involve reading from database/remote HTTP service, so we don't have the answer straight away, in that case we need an async validator)>>>

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

    // ALSO CUSTOM VALIDATION BUT UNLIKE IN 3.JS ITS ASYNC CUSTOM VALIDATION >>>
    // note: If you need to talk to a database or a remote service to perform the validation, you need to create an async validator;

    // Im gonna turn custom validation from previous file to async validation >>>
    validate: {
      // <<< async validation
      isAsync: true, // < add this (its deprecated though)
      // IT WORKS BUT >>>>>>> (node:9464) DeprecationWarning: Mongoose: the `isAsync` option for custom validators is deprecated. Make your async validators return a promise instead: https://mongoosejs.com/docs/validation.html#async-custom-validators
      validator: function (v, callback) {
        // < add callback parameter
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000); // < just to simulate "kick off some async work"
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
