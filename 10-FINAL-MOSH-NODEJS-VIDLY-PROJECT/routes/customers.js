const validateRequest = require("../middleware/validateRequest");
const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", validateRequest(validate), async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", validateRequest(validate), async (req, res) => {
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
