// This lecture: anywhere that you have an asynchronous function that takes a callback, you should modify that function to return a promise;

// Instead of using callback, now we're using Promises (VIDEO TITLE:"REPLACING CALLBACKS WITH PROMISES") >

// HOW? > modify asynchronous functions to now return a promise >
console.log("Before");
// getUser(1, (user) => {           // getUser() returns user object, which explains parameter in this line!
//   getRepositories(user.gitHubUsername, (repos) => {
//     getCommits(repos[0], (commits) => {
//       console.log(commits);
//     });
//   });
// });

// note: commented out codes above this line is just for comparison with promises like in line below;

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------

// How to CONSUME promises instead of callback approach like above commented codes >
getUser(9875)
  .then((user) => getRepositories(user.gitHubUsername)) // getUser() returns user obj, so in this line param is user, then connect next function...
  .then((repos) => getCommits(repos[0]))
  .then((commits) => console.log("Commits", commits))
  .catch((err) => console.log("Error- ", err.message));

console.log("After");

function getUser(id) {
  return new Promise((resolve, reject) => {
    // kick off some async work >
    setTimeout(() => {
      console.log("Reading a user from a database...");
      resolve({ id: id, gitHubUsername: "mosh" }); // resolve() instead of callback(), so remove callback parameter in this function;
    }, 2000);
  });
}

function getRepositories(username) {
  return new Promise((resolve, reject) => {
    // kick off some async work >
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["repo1", "repo2", "repo3"]);
    }, 2000);
  });
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    // kick off some async work >
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["commit"]);
    }, 2000);
  });
}
