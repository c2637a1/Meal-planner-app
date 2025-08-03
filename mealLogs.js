const express = require("express");
const router = express.Router();
const MealLog = require("../models/MealLog");

router.post("/log", async (req, res) => {
  await MealLog.create(req.body);
  res.json({ success: true });
});

router.get("/daily/:date", async (req, res) => {
  const logs = await MealLog.find({ date: req.params.date }).populate("recipe");
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  logs.forEach(l => {
    const n = l.recipe.nutrition;
    total.calories += n.calories;
    total.protein += n.protein;
    total.carbs += n.carbs;
    total.fat += n.fat;
  });
  res.json({ logs, total });
});

module.exports = router;
