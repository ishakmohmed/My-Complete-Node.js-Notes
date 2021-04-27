// Exercise: rewrite downloaded codes using async and await;

// getCustomer(1, (customer) => {
//   console.log("Customer: ", customer);
//   if (customer.isGold) {
//     getTopMovies((movies) => {
//       console.log("Top movies: ", movies);
//       sendEmail(customer.email, movies, () => {
//         console.log("Email sent...");
//       });
//     });
//   }
// });

// REPLACING CALLBACK ^ WITH ASYNC AND AWAIT, OF COURSE, I CHANGED THE FUNCTIONS BELOW THIS ASYNC FUNCTION SO THAT IT WORKS WITH ASYNC AND AWAIT, LIKE I REMOVED CALLBACK AND REPLACED WITH RESOLVE, AND ADDED RETURN NEW PROMISE...

async function notifyCustomer() {
  const customer = await getCustomer(1); // awaiting cause it returns promise down there;
  console.log("Customer", customer);
  if (customer.isGold) {
    const movies = await getTopMovies();
    console.log("Top movies: ", movies);
    await sendEmail(customer.email, movies); // not storing anything cause down there resolving without any value, basically resolve();
    console.log("Email sent...");
  }
}

notifyCustomer();

// note: in this file I could use async and await only cause these functions below return Promises;

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    // this callback fn is called executor;
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Mosh Hamedani",
        isGold: true,
        email: "email",
      });
    }, 4000);
  });
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["movie1", "movie2"]);
    }, 4000);
  });
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(); // you're not resolving and returning a value, you're just resolving it;
    }, 4000);
  });
}
