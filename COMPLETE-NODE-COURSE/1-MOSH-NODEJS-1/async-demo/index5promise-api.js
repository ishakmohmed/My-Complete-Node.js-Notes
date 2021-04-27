// CREATING SETTLED PROMISES >

const p = Promise.resolve({ id: 123 }); // arg in resolve is optional and can be whatever arg;
// basically this ^ promise is already resolved >
p.then((result) => console.log(result));

// Similarly, now you might wanna create a promise that is already rejected >

// const prom = Promise.reject(new Error('failed for no reason hehehe'));
// prom.catch((error) => console.log(error));

