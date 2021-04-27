// RUNNING PROMISES IN PARALLEL >

const p1 = new Promise((resolve) => { // < you can add reject param if you want to, not used in this case;
  setTimeout(() => {
    console.log("Async operation 1...");
    resolve(1);
  }, 2000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("Async operation 2...");
    resolve(2);
  }, 2000);
});

// note: arg for all is A-R-R-A-Y of promises;
Promise.all([p1, p2]).then((result) => console.log(result)); // Promise.all() returns new promise that will be resolved when all the promises in this array will be resolved;

// note: the result will be available as an array;

// note: IF ANY ONE OF THESE PROMISES IS REJECTED, BASICALLY YOU CAN'T SEE THE RESULT IN PROMISE.ALL (LIKE FINAL RESULT, if thats happened in this implementation, you can see "Async operation 1..." and "Async operation 2" , and then youll get error message). OF COURSE, IF YOU WANNA REJECT P1 FOR EXAMPLE, JUST ADD ANOTHER PARAMETER IN P1 FN, THEN CHANGE RESOLVE TO REJECT in that fn AND IN PROMISE.ALL, MAKE SURE YOU CHAIN CATCH();

// ^ if any 1 promise get rejected, the final promise that gets returned from Promise.all() get rejected;
// --------------------------------------
// --------------------------------------

// now, instead of displaying result when all operation completes, you might wanna display result as soon as one the operation completes (maybe the first, maybe the second, basically the fastest), so you change all() to race(), all the concepts are same with all() except that the result now will not be an array but just the resolved result of the first fulfilled promise >
Promise.race([p1, p2]).then((result) => console.log(result));

// as soon as 1 promise in array is fulfilled, the final promise that is returned from this race method will be considered fulfilled;
