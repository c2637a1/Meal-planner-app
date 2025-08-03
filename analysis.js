const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');

// 建議的每日營養攝取量 (可根據需求調整)
const DAILY_RECOMMENDATIONS = {
    calories: 2000,
    protein: 50, // g
    carbs: 300,  // g
    fat: 70      // g
};

// POST /api/analysis/log - 紀錄一餐
router.post('/log', async (req, res) => {
    const { date, recipeId } = req.body; // date: 'YYYY-MM-DD'
    try {
        let log = await DailyLog.findOne({ date });
        if (!log) {
            log = new DailyLog({ date, meals: [] });
        }
        log.meals.push({ recipe: recipeId });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /api/analysis/report/:date - 取得某日營養分析報表
router.get('/report/:date', async (req, res) => {
    try {
        const log = await DailyLog.findOne({ date: req.params.date }).populate('meals.recipe');
        if (!log) {
            return res.status(404).json({ message: '找不到該日期的紀錄' });
        }

        // 1. 自動計算總營養
        const totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        log.meals.forEach(meal => {
            if (meal.recipe && meal.recipe.nutrition) {
                totalNutrition.calories += meal.recipe.nutrition.calories;
                totalNutrition.protein += meal.recipe.nutrition.protein;
                totalNutrition.carbs += meal.recipe.nutrition.carbs;
                totalNutrition.fat += meal.recipe.nutrition.fat;
            }
        });

        // 2. 產生營養均衡提示
        let tips = [];
        if (totalNutrition.calories > DAILY_RECOMMENDATIONS.calories * 1.1) tips.push("今日熱量攝取可能偏高，請注意。");
        if (totalNutrition.calories < DAILY_RECOMMENDATIONS.calories * 0.8) tips.push("今日熱量攝取可能不足，請確保補充足夠能量。");
        if (totalNutrition.protein < DAILY_RECOMMENDATIONS.protein * 0.8) tips.push("蛋白質攝取不足，可考慮增加豆魚蛋肉類。");
        if (totalNutrition.fat > DAILY_RECOMMENDATIONS.fat * 1.2) tips.push("脂肪攝取可能過多，建議選擇較清淡的烹調方式。");


        res.json({
            date: log.date,
            meals: log.meals,
            totalNutrition,
            tips // 營養均衡提示
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
