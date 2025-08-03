const mongoose = require("mongoose");

const MealLogSchema = new mongoose.Schema({
  date: { type: String }, // YYYY-MM-DD
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  type: String, // breakfast, lunch, dinner
});

module.exports = mongoose.model("MealLog", MealLogSchema);