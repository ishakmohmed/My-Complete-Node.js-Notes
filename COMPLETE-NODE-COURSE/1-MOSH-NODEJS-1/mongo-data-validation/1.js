const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/mongo-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Validation >

const courseSchema = new mongoose.Schema({
  // the validation below is only meaningful in mongoose, mongodb doesnt care about it;
  name: { type: String, required: true }, // If I create a course without name, I'll get an exception when I try to save to database. (node:10468) UnhandledPromiseRejectionWarning: ........... , but if I use try-catch, i can simplifiy the error message;
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular course",
    author: "Mosh",
    tags: ["Angular", "Frontend"],
    isPublished: true,
  });

  try {
    // name is required, so in case you create a document without name, so try-catch;
    const result = await course.save(); // problem happens here if you don't specify name (mongoose's job)
    console.log(result);

    // or (instead of course.save()) YOU CAN TRIGGER VALIDATION LOGIC (MONGOOSE) MANUALLY >>>
    // await course.validate();   <<< if theres error, you'll get same error message like course.save() gives;

    // note: you don't store anything from course.validate(), just start with await... like I wrote in line above;

    //or (instead of course.save())
    // course.validate(err => {
    //   if (err) {
    //     // do something (obv can add more stuffs in catch blovk but its better to place most of the stuffs over here related to course.validate() error)....
    //   }
    // });
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();
