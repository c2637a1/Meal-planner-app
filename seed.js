const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");

const data = [
  {
    name: "番茄炒蛋",
    type: "lunch",
    ingredients: ["番茄", "雞蛋", "鹽", "油"],
    nutrition: {
      calories: 200,
      protein: 10,
      carbs: 5,
      fat: 10
    }
  },
  {
    name: "燕麥牛奶",
    type: "breakfast",
    ingredients: ["燕麥", "牛奶"],
    nutrition: {
      calories: 150,
      protein: 6,
      carbs: 20,
      fat: 4
    }
  },
  {
    name: "炒蛋吐司",
    type: "breakfast",
    ingredients: ["雞蛋", "吐司", "奶油"],
    nutrition: { calories: 300, protein: 12, carbs: 25, fat: 15 }
  },
  {
    name: "番茄牛肉飯",
    type: "lunch",
    ingredients: ["白飯", "牛肉", "番茄"],
    nutrition: { calories: 600, protein: 35, carbs: 50, fat: 20 }
  },
  {
    name: "鮭魚烤蔬菜",
    type: "dinner",
    ingredients: ["鮭魚", "花椰菜", "橄欖油"],
    nutrition: { calories: 500, protein: 30, carbs: 15, fat: 25 }
  },
  {
    name: "蔬菜炒蛋",
    type: "breakfast",
    ingredients: ["蛋", "青椒", "洋蔥"],
    nutrition: { calories: 200, protein: 12, carbs: 5, fat: 15 }
  },
  {
    name: "雞胸肉飯",
    type: "lunch",
    ingredients: ["雞胸肉", "白飯", "花椰菜"],
    nutrition: { calories: 550, protein: 40, carbs: 45, fat: 10 }
  },
  {
    name: "味噌湯+豆腐飯",
    type: "dinner",
    ingredients: ["味噌", "豆腐", "飯"],
    nutrition: { calories: 400, protein: 18, carbs: 40, fat: 8 }
  }
];

mongoose.connect("mongodb://localhost:27017/meal_planner").then(async () => {
  await Recipe.deleteMany({});
  await Recipe.insertMany(sample);
  console.log("✅ Seed completed");
  process.exit();
});

async function seed() {
  await Recipe.deleteMany();
  await Recipe.insertMany(data);
  console.log("✅ Seed 資料匯入成功！");
  mongoose.disconnect();
}

seed();

