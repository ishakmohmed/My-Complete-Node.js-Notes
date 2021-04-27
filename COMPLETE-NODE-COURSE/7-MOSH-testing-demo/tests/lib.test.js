// name it like this, otherwise it wouldn't work >>> moduleName.spec/test.js

// test("Our first test", () => {
//   throw new Error("something failed");
// });

// ------------------------------------------------------------
// TESTING NUMBERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

// test('absolute - should return a positive number if input is positive', () => {
//   const result = lib.absolute(1);
//   expect(result).toBe(1);
// });

// test('absolute - should return a positive number if input is negative', () => {
//   const result = lib.absolute(-1);
//   expect(result).toBe(1);
// });

// test('absolute - should return 0 if input is 0', () => {
//   const result = lib.absolute(0);
//   expect(result).toBe(0);
// });

// NOW IM GONNA GROUP ALL THESE RELATED TESTS TOGETHER >>>

describe("absolute", () => {
  // describe() fn to group related tests!
  it("should return a positive number if input is positive", () => {
    // simplified string, now not prefixed with "absolut- should....", instead "should...."
    // you can replace test() with it();
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is negative", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return 0 if input is 0", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

// -----------------------------------------------------------
// TESTING STRINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// when testing strings, make sure your tests are not too specific!

describe("greet", () => {
  it("should return the greeting message", () => {
    const result = lib.greet("Mosh");
    expect(result).toMatch(/Mosh/); // toMatch() - pass a regular expression!
    expect(result).toContain("Mosh"); // or you might wanna use toContain() fn!
  });
});

// -----------------------------------------------------------
// TESTING ARRAY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    // only 1 it() because 1 execution path!
    const result = lib.getCurrencies();

    // Too general >>>
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // Too specific >>>
    expect(result[0]).toBe("USD");
    expect(result[1]).toBe("AUD");
    expect(result[2]).toBe("EUR");
    expect(result.length).toBe(3);

    // Proper way, not ideal yet >>>
    expect(result).toContain("USD");
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");

    // Ideal way >>>
    expect(result).toEqual(expect.arrayContaining(["EUR", "AUD", "USD"])); // these currencies can be in any order. YOU CAN CHECK DOCUMENTATION IF YOU FORGET THE SYNTAX!
  });
});

// -----------------------------------------------------------

// TESTING OBJECTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

describe("getProduct", () => {
  it("should return the product with given id", () => {
    const result = lib.getProduct(1);
    // expect(result).toBe({ id: 1, price: 10 });  // don't use toBe() for objects cause it checks the memory location of the 2 objects you compare, so use toEqual();

    expect(result).toEqual({ id: 1, price: 10 }); // both obj must have exactly these 2 properties with exact values!

    // it better to use toMatchObject() or toHaveProperty() >>>

    expect(result).toMatchObject({ id: 1, price: 10 }); // the result must have these 2 properties with exact values BUT the result can also have more properties!

    expect(result).toHaveProperty("id", 1); // pass key value, 2nd arg is optional fmi in later lectures!
  });
});

// -----------------------------------------------------------

// TESTING EXCEPTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// RECAP: falsy values in JavaScript are Null, undefined, NaN, '', 0, false!
describe("registerUser", () => {
  it("should throw if username is falsy", () => {
    // for exception, you don't get the result and test it, cause if a code throws an exception you won't get any result, only exceptions!
    // so in expect(), pass a callback fn containing the code that'll throw exception, and test with toThrow() right away!
    expect(() => {
      lib.registerUser(null);
    }).toThrow();

    // NOTE: AS THE TIME OF RECORDING, JEST DOESNT SUPPORT PARAMETERIZED tests to avoid duplication of long codes, so here is an alternative approach >>>

    const args = [null, undefined, NaN, "", 0, false];
    args.forEach((a) => {
      expect(() => {
        // same codes like in previous test!
        lib.registerUser(a);
      }).toThrow();
    });
  });

  // NOW, LET'S WRITE THE TEST CASE FOR HAPPY PATH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  it("should return a user object if valid username is passed", () => {
    // YOU'RE SUPPOSED TO GET >>>>>>>>>>>>>>> { id: new Date().getTime(), username: username }
    const result = lib.registerUser("mosh");
    expect(result).toMatchObject({ username: "mosh" });
    expect(result.id).toBeGreaterThan(0); // current time will be different the moment we call this method to when we make an assertion, basically its kinda difficult to test date/time, SO IM JUST CHECKING IF ITS GREATER THAN 0!
  });
});

// --------------------------------------------------------------------------------

// MOCK FUNCTIONS- REPLACING EXTERNAL RESOURCES WITH MOCK FUNCTIONS IN UNIT TESTING >>>

describe("applyDiscount", () => {
  // basically, since this function talks to an external resource, in this case one of the function in db.js lets call it XYZ, we need to create a mock function of XYZ over here by assigning it to a new function with similar implementation. Don't worry if this implementation will override the actual implementation, because that won't happen since this is just a test.

  it("should apply 10% discount if customer has more than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      // step 1: create mock function of the external resource!
      console.log("Fake reading customer...");
      return { id: customerId, points: 20 };
    };

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order); // apply discount uses getCustomerSync, but in this test i changed it to a mock function so it gives me the same result all the time, so im avoiding errors from external services!
    expect(order.totalPrice).toBe(9);
  });
});

// --------------------------------------------------------------------------

// Interaction testing- 2 other mock function >>>

describe("notifyCustomer", () => {
  it("should send an email to customer", () => {
    db.getCustomerSync = function (customerId) {
      // mock fn 1
      return { email: "a" };
    };

    let mailSent = false;
    mail.send = function (email, message) {
      // mock fn 2, but need boolean so that if this final function in the process gets called the boolean which is initially set to false will be reassigned to true;
      mailSent = true;
    };

    lib.notifyCustomer({ customerId: 1 }); // actually call the function, which will call the 2 mock functions above, not the original implementation!

    expect(mailSent).toBe(true); // check if boolean is changed to true in the last function in the chain!
  });
});

// ----------------------------------------------------------------

// A better implementation using Jest mock function >>>

// A little bit of notes first >>>

// const mockFunction = jest.fn();
// mockFunction.mockReturnValue(1);  // returns number
// const result = mockFunction();

// const mockFunction = jest.fn();
// mockFunction.mockResolvedValue(1); // returns promise
// const result = await mockFunction();

// const mockFunction = jest.fn();
// mockFunction.mockRejectedValue(new Error("..."));
// const result = await mockFunction(); // needa be in try-catch block;

describe("notifyCustomer", () => {
  it("should send an email to customer", () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
    mail.send = jest.fn(); // NOW IM NOT USING A BOOLEAN TO CHECK IF THIS FN IS CALLED, needa call toHaveBeenCalled() in assertion down there cause this is the last function in the "chain"! NOTE: theres no mockReturnValue() for this one cause it doesnt return anything, you just wanna check if it has been called down there!

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled(); // can only call this matcher if its a Jest mock function, not for manual mock functions!

    // SOMETIMES YOU WANNA ALSO CHECK THE ARGUMENTS THAT ARE PASSED WITH A METHOD >>>

    // expect(mail.send).toHaveBeenCalledWith('a', '...');   // < but this is not suitable for string cause too specific, FOR OTHER TYPES THAN STRING LIKE NUMBERS, this method is suitable!

    // Since above commented out way is not a good idea (FOR STRING ARGUMENTS!!!!!!!!!!!!) to check if a function is called with certain arguments, here is a better way >>>

    expect(mail.send.mock.calls[0][0]).toBe("a"); // mock fn has a property called "mock", inside that another property called "calls" (an ARRAYYYYY) which keeps track of all the calls to this mock function, so we access the first element that is the first call to this function, now this returns an array of arguments, so we can access the first argument , and then assert that this arguments equals to 'a';

    // now similarly, we can check the second argument and here instead of using an exact equality check, we can use a regular expression >>>>>>>>>>>>>>>
    expect(mail.send.mock.calls[0][1]).toMatch(/order/); // SUPER IMPORTANT NOTE: say when fn 1 calls fn 2 & 3 like >> fn1() { fn2(argA, argB), fn3(argC, argD) }, yeah the implementation of fn2 and fn3 will be different but since this is the first function, the argument passed will be the same, BECAUSE THE FIRST FUNCTION IS NOTTTTTTTTTTTTTT A MOCK FUNCTION!
  });
});
