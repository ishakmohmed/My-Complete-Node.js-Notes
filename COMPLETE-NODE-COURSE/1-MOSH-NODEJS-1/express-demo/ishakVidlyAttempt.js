const Joi = require("joi");
const express = require("express");
const app = express();

const genres = [
  { id: 1, name: "action" },
  { id: 2, name: "romance" },
  { id: 3, name: "comedy" },
  { id: 4, name: "horror" },
  { id: 5, name: "adventure" },
];

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre with given ID not found!");

  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const schema = { name: Joi.string().min(3).required() };
  const { error } = Joi.validate(req.body, schema); // fmi, might be wrong, when Joi.validate(), use req.body (AKA everything?), but when you wanna get the name, use req.body.name!

  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre with given ID not found!");

  const schema = { name: Joi.string().min(3).required() };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre with given ID not found!");

  genres.splice(genres.indexOf(genre), 1);
  res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
