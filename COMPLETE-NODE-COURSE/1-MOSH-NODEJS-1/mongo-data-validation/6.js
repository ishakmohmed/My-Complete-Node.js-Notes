const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SchemaType Options (in this lecture we're gonna look at few more stuffs) >>>

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
    // THESE THREE ARE FOR STRING >>>
    lowercase: true, // << will be converted to all lowercase by MONGOOSE;
    // uppercase: true,   // << you know
    trim: true, // <<< trim paddings around string
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
    get: (v) => Math.round(v), // <<< custom getter, whenever you get property with decimal, itll be rounded off
    set: (v) => Math.round(v), // <<< custom setter, whenever you set price property with decimal, itll be rounded off;
  },
});

const Course = mongoose.model("courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular course",
    category: "network",
    author: "Mosh",
    tags: ["React Native", "Facebook"],
    isPublished: true,
    price: 15,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
}

createCourse();
