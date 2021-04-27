// note: for line below, of course you can just not use object desctruring (which is a bad idea), so when you import you store in a constant like customer. So down there, you should change your validate function to customer.validate and Customer to customer.Customer, which again is a bad idea;

const { Customer, validate } = require("../models/customer"); // make sure these names, which are Customer and validate in object destructuring are the same like exported in customer.js;
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// if only you wanted to place all the codes in 1 folder such that models folder wouldn't exist which is a bad idea, IN THIS EXACT LINE YOU WILL BE DEFINING CUSTOMER SCHEMA AND THEN YOULL COMPILE IT INTO A MODEL, AND AT THE VERY BOTTOM YOU'LL VALIDATE CUSTOMERS;

// this file needs all the codes from customer.js inside "models" folder;

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    res.status(404).send("The customer with the given ID was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");

  res.send(customer);
});

router.get("/id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");

  res.send(customer);
});

module.exports = router;
