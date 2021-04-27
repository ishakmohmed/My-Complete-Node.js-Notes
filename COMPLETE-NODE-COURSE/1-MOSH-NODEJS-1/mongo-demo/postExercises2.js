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
// *************************************************************************

// 2 ways to update documents >
// - query first (findById(), modify its properties, save())
// - update first (update directly, optionally get the updated document as well)

// UPDATE FIRST (YOU DONT NEED TO SAVE IT!!!!!!!!!!) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// you dont need to save it!!! >>>

async function updateCourse(id) {
  const result = await Course.update(
    // result here is { n: 1, nModified: 1, ok: 1 }
    { _id: id },
    {
      $set: {
        author: "LASSTTT TRYY",
        isPublished: false,
      },
    }
  );

  console.log(result);
}
// IN FUTURE IF YOU FACE ANY PROBLEM UPDATING >>> (node:1516) DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
updateCourse("5f76c5716686e31448fd6cad");

// *************************************************************************

// MongoDB update operators >
// $currentDate: sets the value of a field to current date either as a Date or Timestamp
// $inc: increments the value of the field by the specified amount
// $min: only updates the field if the specified value is less than the existing field value
// $max: only updates the field if the specified value is greater than the existing field value
// $mul: multiplies the value of the field by the specified amount
// $rename: renames a field
// $set: sets the value of a field in a document
// $setOnInsert: sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents
// $unset: removes the specified field from a document
