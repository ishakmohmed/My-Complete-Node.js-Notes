// ASYNC AND AWAIT (better than callbacks and promises) >

console.log("Before");
// Promise-based approach >
// getUser(9875)
//   .then((user) => getRepositories(user.gitHubUsername))
//   .then((repos) => getCommits(repos[0]))
//   .then((commits) => console.log("Commits", commits))
//   .catch((err) => console.log("Error- ", err.message));

// REWRITING ABOVE STUFF USING ASYNC AND AWAIT >>>>>>>>>>

// Async and await approach (BASICALLY YOU CAN WRITE ASYNC CODE THAT LOOKS LIKE SYNC CODE, BTW THEY'RE SYNTACTICAL SUGAR OVER PROMISES) >
async function displayCommits() {
  // needa place await fns in fn that is decorated with async;
  try { // instead of .catch() like in promise-based approach, use try-catch blocks;
    const user = await getUser(9875); // anytime you're calling a fn that returns a promise, you can await result of that fn;
    const repos = await getRepositories(user.gitHubUsername);
    const commits = await getCommits(repos[0]);
    console.log(commits);
  } catch (err) {
    console.log("Error", err.message);
  }
}

displayCommits(); // finally call it;

console.log("After");

function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Reading a user from a database...");
      resolve({ id: id, gitHubUsername: "mosh" });
    }, 2000);
  });
}

function getRepositories(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["repo1", "repo2", "repo3"]);
    }, 2000);
  });
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Calling GitHub API...");
      resolve(["commit"]);
    }, 2000);
  });
}
