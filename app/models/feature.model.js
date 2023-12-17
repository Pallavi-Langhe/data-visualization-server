const mongoose = require("mongoose");

const Feature = mongoose.model(
  "Feature",
  new mongoose.Schema({
    feature_name: String,
    value: Number,
    age: String,
    gender: String,
    day: Date,
  })
);

module.exports = Feature;
