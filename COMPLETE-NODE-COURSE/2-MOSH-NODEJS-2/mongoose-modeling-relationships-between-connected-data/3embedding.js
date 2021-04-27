// EMBEDDING DOCUMENTS (IN THIS LECTURE WERE GONNA EMBED AN AUTHOR DOCUMENT INSIDE A COURSE DOCUMENT)>>>

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String, // obviously you can pass a SchemaType object and then inside it name: String, required: true
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    // for below, if you wanna make author property required, then just > author: { type: authorSchema, required: true }
    author: authorSchema, // <<< THIS IS THE ONLY CHANGE WE NEEDA MAKE, in the last lecture author was { type: mongoose.Schema.Types.ObjectId, ref: 'Author'}, now its an entire authorSchema, were gonna embed an author document directly inside a course document!

    // So when you create a course, result will be >>>
    //     {
    //   _id: 5f89c0c002865a1924d04d49,
    //   name: 'Node Course',
    //   author: { _id: 5f89c0c002865a1924d04d48, name: 'Mosh' },
    //   __v: 0
    // }
  })
);

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// createCourse("Node Course", new Author({ name: "Mosh" }));

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// lets say i wanna update a course, its the same thing like in previous lectures, i dont know why im writing this function below, i guess just so that i can recall better >>>
async function updateAuthor(courseId) {
  //courseId here is the ObjectId of parent, you can't search child right away!
  const course = await Course.findById(courseId);
  course.author.name = "Mosh Hamedani";
  course.save(); // although you wanna update the author which is inside course, when you wanna save, you must save in the context of the parent, so course.save(), not course.author.save();
}
// updateAuthor("5f8ae7a8affdc033206c42a9");  // arg here is courseId

// or you can update a sub document directly in the database >>>
// instead of querying the document first, I can >>>

async function updateAuthor(courseId) {
  // with this approach you dont needa get the document first, and dont needa save explicitly;
  const course = await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        "author.name": "John Smithhhh", // IM KINDA STRONGLY SURE BUT NOT 100% SURE > IF YOU'RE USING THE DOT NOTATION IN $$$$$SETTTTTTTTT, NEED TO USE DOT OF COURSE AND ALSO PLACE IT IN QUOTES, LIKE "author.name";   ONE SECOND, FOR UNSET BELOW, MOSH placed author in quotes like 'author', but i didnt put quotes and it worked, SO MY NEW CONCLUSION IS, if you use $set or $unset, use quotes for properties OR DONT USE AT ALL, JUST KEEP IT CONSISTENT!!!!
      },
    }
  ); // if i recall correctly, as the last argument, if you pass { new: true}, you can get the updated document;
}
// updateAuthor("5f8ae7a8affdc033206c42a9");   // arg here is courseId
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

// YOU CAN ALSO REMOVE SUB DOCUMENT, SO USE THE UNSET OPERATOR >>>

async function updateAuthor(courseId) {
  const course = await Course.update(
    { _id: courseId },
    {
      $unset: {
        // use the unset operator!
        author: "", // unset author document entirely like i did here (set to empty string although author document is not a string), or author.name if only wanna remove name, AFTER COLON SET TO EMPTY STRING
      },
    }
  );
}

updateAuthor("5f8ae7a8affdc033206c42a9"); // arg here is courseId
