const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    nutrition: nutritionSchema,
    allergens: [{ // 過敏原提醒欄位
        type: String,
        trim: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
