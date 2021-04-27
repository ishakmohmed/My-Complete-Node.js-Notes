// video title: "named function to the rescue"

// Fixing callback fn from previous file >
// HOW? > swap last callback fn (ANONYMOUS FN) in each method to reference of NAMED FN outside nest;

console.log("before");
getUser(1, getRepositories);
console.log("after");

function getRepositories(user) {
  getRepositories(user.githubUsername, getCommits);
}

function getCommits(repos) {
  getCommits(repos, displayCommits);
}

function displayCommits(commits) { // supposedly inner most function in callback hell;
  console.log(commits);
}

// & & & & & & & & & & & & & & & & & & & & &
// & & & & & & & & & & & & & & & & & & & & &
function getUser(id, callback) {
  setTimeout(() => {
    console.log(`Reading user from database`);
    callback({ id: id, githubUsername: "mohmed" });
  }, 2000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log(`Calling GitHub API...`);
    callback(["repo1", "repo2", "repo3"]);
  }, 2000);
}
// & & & & & & & & & & & & & & & & & & & & &
// & & & & & & & & & & & & & & & & & & & & &