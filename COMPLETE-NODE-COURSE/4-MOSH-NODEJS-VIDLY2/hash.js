const bcrypt = require("bcrypt");

// 1234 --hash--> abcd;
// A salt is basically a random string that is added before or after this password, so the resulting hash password will be different each time based on the salt that is used;

// theres genSalt() and genSaltSync(), as the best practice use genSalt() because its asynchronous!

async function run() {
  const salt = await bcrypt.genSalt(10); // arg is number of times to run this algorithm to generate salt, the higher, the longer to generate, the harder to break. You can also pass the 2nd argument as a callback function like in official documentation and a lot of tutorials, but this method also has an overload that returns a promise, thats what were doing!
  const hashed = await bcrypt.hash("1234", salt); // or the 3rd arg call be a callback, but now im gonna get the promise returned from this method;
  console.log(salt); // $2b$10$ucQi6WiMLFaOZAVVG2GofO    <<< 10 here on the left is the genSalt()'s arg!
  console.log(hashed); // the salt will be included inside hash password, in my observation, prefixed, but cant confirm itll be prefixed everytime sometimes itll be postfixed!
}

run();

// later on when user wants to login, hell send plaintext password like myPassword1, and we needa hash it again WITH THE ORIGINAL SALT USED TO HASH PASSWORD and compare the hashed password and the hashed password in the database;