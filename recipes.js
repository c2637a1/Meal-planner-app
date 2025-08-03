const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET /api/recipes - 取得所有食譜
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/recipes/random - 隨機推薦一筆食譜
router.get('/random', async (req, res) => {
    try {
        const count = await Recipe.countDocuments();
        const random = Math.floor(Math.random() * count);
        const recipe = await Recipe.findOne().skip(random);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/recipes - 新增食譜
router.post('/', async (req, res) => {
    const recipe = new Recipe(req.body);
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/recipes/:id - 更新食譜
router.put('/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/recipes/:id - 刪除食譜
router.delete('/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: '食譜已刪除' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
