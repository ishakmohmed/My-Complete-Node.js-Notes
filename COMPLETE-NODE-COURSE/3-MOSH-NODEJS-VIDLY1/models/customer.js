// SINGLE RESPONSIBILITY PRINCIPLE: this customer module has all the code for defining and validating a customer object (it knows what a customer should look like);

const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  // mosh (not exact words): since this validation such as minimum 5, maximum 50, and name is required, is written here and also in the schema, there is duplication, which you might think will lead to problem whereby if you need to change some logic, you wanna change it in 2 places, but mosh said he doesnt worry about this because these logics arent gonna change so you dont have to change them, for example, name will always be required so you dont have to worry about that because Mosh is not!
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer; // or module.exports
exports.validate = validateCustomer;
