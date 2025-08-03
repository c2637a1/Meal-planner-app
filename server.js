const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/meal-planner';

// 中介軟體 (Middleware)
app.use(cors()); // 允許跨來源請求 (CORS)
app.use(express.json()); // 解析 JSON 格式的請求主體

// 連接 MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// API 路由
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/analysis', require('./routes/analysis'));

// 根路由
app.get('/', (req, res) => {
    res.send('Meal Planner Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
