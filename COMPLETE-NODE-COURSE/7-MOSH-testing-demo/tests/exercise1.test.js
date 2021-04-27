const lib = require("../exercise1");

describe("fizzBuzz", () => {
  it("should throw an exception if input is not a number", () => {
    // or I guess you can store these in an array, and then use forEach() loop!
    expect(() => {
      lib.fizzBuzz("a");
    }).toThrow();
    expect(() => {
      lib.fizzBuzz(null);
    }).toThrow();
    expect(() => {
      lib.fizzBuzz(undefined);
    }).toThrow();
    expect(() => {
      lib.fizzBuzz({});
    }).toThrow();
  });

  it("should return FizzBuzz if input is divisible by 3 and 5", () => {
    const result = lib.fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if input is only divisible by 3", () => {
    const result = lib.fizzBuzz(3);
    expect(result).toBe("Fizz");
  });

  it("should return FizzBuzz if input is only divisible by 5", () => {
    const result = lib.fizzBuzz(5);
    expect(result).toBe("Buzz");
  });

  it("should return input if it is not divisible by 3 or 5", () => {
    const result = lib.fizzBuzz(1);
    expect(result).toBe(1);
  });
});
