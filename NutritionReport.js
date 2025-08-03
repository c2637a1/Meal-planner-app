import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Paper, Typography, Box, Grid } from '@mui/material';

// 註冊 Chart.js 需要的元件
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// 建議的每日營養攝取量 (與後端對應)
const DAILY_RECOMMENDATIONS = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 70,
};

function NutritionReport({ report }) {
    if (!report) return null;

    const { totalNutrition } = report;

    // 1. 長條圖資料：比較攝取量與建議量
    const barChartData = {
        labels: ['熱量 (kcal)', '蛋白質 (g)', '碳水 (g)', '脂肪 (g)'],
        datasets: [
            {
                label: '您的攝取量',
                data: [
                    totalNutrition.calories,
                    totalNutrition.protein,
                    totalNutrition.carbs,
                    totalNutrition.fat,
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: '每日建議量',
                data: [
                    DAILY_RECOMMENDATIONS.calories,
                    DAILY_RECOMMENDATIONS.protein,
                    DAILY_RECOMMENDATIONS.carbs,
                    DAILY_RECOMMENDATIONS.fat,
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    // 2. 環圈圖資料：計算三大營養素熱量佔比
    // 1g 蛋白質/碳水 ≈ 4大卡, 1g 脂肪 ≈ 9大卡
    const proteinCalories = totalNutrition.protein * 4;
    const carbsCalories = totalNutrition.carbs * 4;
    const fatCalories = totalNutrition.fat * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

    const doughnutChartData = {
        labels: ['蛋白質', '碳水化合物', '脂肪'],
        datasets: [
            {
                data: [
                    // 避免 totalMacroCalories 為 0 的情況
                    totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0,
                    totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0,
                    totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)', // 黃色
                    'rgba(75, 192, 192, 0.7)', // 綠色
                    'rgba(255, 99, 132, 0.7)', // 紅色
                ],
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };
    
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '三大營養素熱量分佈 (%)',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed.toFixed(2) + '%';
                        }
                        return label;
                    }
                }
            }
        },
    };
    
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '每日營養攝取分析',
                font: { size: 16 }
            },
        },
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h5" gutterBottom align="center">
                📅 {report.date} 營養分析報告
            </Typography>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                    <Bar options={barOptions} data={barChartData} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Doughnut options={doughnutOptions} data={doughnutChartData} />
                </Grid>
            </Grid>
            
            {report.tips && report.tips.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>💡 營養均衡提示</Typography>
                    <ul>
                        {report.tips.map((tip, index) => (
                            <li key={index}><Typography>{tip}</Typography></li>
                        ))}
                    </ul>
                </Box>
            )}
        </Paper>
    );
}

export default NutritionReport;