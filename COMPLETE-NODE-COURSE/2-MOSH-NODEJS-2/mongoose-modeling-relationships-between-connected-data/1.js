// Modeling relationships, 2 approaches >

// Trade off between query performance vs consistency;

// 1- Using References (Normalization) -> GIVES CONSISTENCY (weve got single place to define an author)
let author = {
  name: "Mosh",
};

let course = {
  author: "moshIdReference",   // you can even pass invalid id, mongodb doesnt care!
  // it can also be something like this >
  // authors: ['id1', 'id2', 'id3']
};

// 2- Using Embedded Documents (Denormalization) -> GIVES QUERY PERFORMANCE (but if i change Mosh to Mosh Hamedani here, chances are there will be multiple courses that needa be updated, which can result in inconsistent data if update is unsuccesful)
// author document embedded inside course document >
let course = {
  author: {
    name: "Mosh",
  },
};

// ---------------------------------------------

// hold on, there is another approach >

// 3- Hybrid >
let author = {
  name: "Mosh",
  // 50 other properties
};

let course = {
  author: {
    // instead of using a reference here, we can embed author document inside course document, but not the complete representation of that author;
    id: "reference to author document ", // << only 2 properties
    name: "Mosh",
  },
};

// With this approach we can quickly read a course object along with its author so we can optimize our query performance, but we dont have to store all those properties of an author inside a course document.

// this approach is particularly useful if you want to have a snapshot of your data at a point in time. For example, imagine youre designing an e commerce application, there well have collections like borders, products, shopping carts, and so on. In each order we need to store snapshot of a product, because we want to know the price of that product at that given point in time, so thats where well use the hybrid approach;
