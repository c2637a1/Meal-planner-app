const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    date: { // 格式為 YYYY-MM-DD
        type: String,
        required: true,
        unique: true
    },
    meals: [{
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        },
        // 可以加入份量等其他資訊
    }]
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
