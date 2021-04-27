// async code >
// console.log("before");
// const user = getUser(1); // op: undefined, cause at this point setTimeout() only schedules in 2 seconds;
// console.log(user);
// console.log("after");

// function getUser(id) {
//   setTimeout(() => {
//     console.log(`Reading user from database`);
//     return { id: id, githubUsername: 'mohmed'};
//   }, 2000);
// }

// 3 patterns to deal with asynchronous code >
// Callbacks
// Promises
// Async/await

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// let's fix above code >
// callback is a fn you call when the result of async operation is ready;
// Callbacks >
console.log("before");

// note: see you've got getUser, inside it you've got getRepositories, basically nested, this is ASYNCHRONOUS btw because you're not getting value from one function and store it and only then call another function (SYNCHRONOUS), THIS NESTED STRUCTURE IS CALLED...

//...CALLBACK HELL OR CHRISTMAS TREE PROBLEM;

// method call, method call, method call, method call >> > >  > >>>> >  > >> >
getUser(1, (user) => {
  // this callback fn takes user cause calback() down there has user obj as parameter;
  console.log("Userrr", user);
  getRepositories(user.githubUsername, (repos) => {
    // repos as parameter cause down there, repos are put in callback();
    console.log("the user's repoooo", repos);
  });
});

console.log("after");

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
