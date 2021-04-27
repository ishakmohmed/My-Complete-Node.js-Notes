// PROMISE: an obj that holds the eventual result of an asynchronous operation;
// promise promises you to give result of async operation;

// promise obj is initially in pending stage, then the result of async operation will change it to resolve/fulfill or reject;

const p = new Promise((resolve, reject) => { // resolve and reject are functions;
  // Kick off some async work...
  // then, one of these 2 happens (resolve or reject)
  setTimeout(() => {
    // resolve(555);               <<<<<<< or comment out below line and uncomment this line;
    reject(new Error(`it's a mess Lmao!`));
  }, 2000);
});

p.then(result =>
  console.log("Result I received from promise object >>> ", result)
).catch(err => console.log("Error-", err.message));

// Anywhere that you have an asynchronous function that takes a callback, you should modify that function to return a promise, see next lecture;
