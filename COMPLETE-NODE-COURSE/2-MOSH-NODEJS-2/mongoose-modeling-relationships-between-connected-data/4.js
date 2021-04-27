// LECTURE: USING AN ARRAY OF SUB DOCUMENTS >>>

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    // IN THE LAST LECTURE (EMBEDDING DOCUMENTS), IT WAS > author: authorSchema, now were gonna use an array of sub documents >>>
    authors: [authorSchema], // this is a change from last file, so to embed a document you can property: schema or property: [schema]
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// createCourse("Node Course", [
//   // ALSO 2ND ARG IS CHANGED TO ARRAY OF SCHEMA, NOT 1 SCHEMA ONLY!
//   new Author({ name: "Mosh" }),
//   new Author({ name: "John" }),
// ]);

// REMEMBER THAT YOU CAN ALWAYS ADD NEW AUTHORS TO EXISTING DOCUMENT (MOSH AND JOHN IN CREATE COURSE ABOVE) BECAUSE THE SUB DOCUMENT IS AN ARRAY;

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

// addAuthor("5f8b0123c0c0b71410de102c", new Author({ name: "Amy" }));

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId); // new knowledge: there is a method called .id() to find child object by their ObjectId, and i used it in this line;
  author.remove(); // new knowledge: .remove() to remove a child object, informal: its pretty much like the child author is removing itself using .remove();
  course.save();
}

removeAuthor("5f8b0123c0c0b71410de102c", "5f8b0a49e2ea37336813b64e");
