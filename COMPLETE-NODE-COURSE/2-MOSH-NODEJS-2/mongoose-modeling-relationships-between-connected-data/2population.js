// Referencing Documents >

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      // <<  ADDED THIS (in this author property, well store an ObjectId that references an author document)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author", // name of target collection;
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    // weird way to remember: .populate("author") means pretty much change author default representation!

    .populate("author", "name -_id") // add this (.populate("author")), author here is property in schema up there > now author will be a COMPLETE REPRESENTATION OF THE AUTHOR DOCUMENT not just the ObjectId, in this case its the firstly created MOSH author document;   // NOTE: name arg .populate("author", "name") here is optional so instead of the complete MOSH document, only his name with _id will be displayed, but if you wanna exclude _id too means you only want the name, do this > 'name -_id'; if i execute this code now, result will be > author: { name: 'Mosh' }
    // .populate('category', 'name') // can populate properties multiple times, category is just example, it doesnt exist, so dont execute this line unlike the .populate() above;
    .select("name");
  console.log(courses);
}

// createAuthor("Mosh", "My bio", "My Website");  // < executed this line first and then commented it out!

// note: arg2 for fn below is Mosh ObjectId from above line!
// createCourse("Node Course", "5f8997c49526f8179c89d05d"); // < executed this line second and then commented it out!

listCourses();
