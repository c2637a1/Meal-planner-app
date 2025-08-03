import React, { useState } from 'react';
import dayjs from 'dayjs';
import { getAnalysisReport } from '../services/api';
import NutritionReport from '../components/NutritionReport'; // 引入圖表元件

// MUI Components
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

function AnalysisPage() {
    const [selectedDate, setSelectedDate] = useState(dayjs()); // 預設今天
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchReport = async () => {
        setIsLoading(true);
        setError('');
        setReport(null);
        try {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const response = await getAnalysisReport(dateStr);
            setReport(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError(`找不到 ${selectedDate.format('YYYY-MM-DD')} 的飲食紀錄。`);
            } else {
                setError('無法獲取報告，請稍後再試。');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    每日營養分析
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    選擇日期以查看當天的完整營養分析報告與圖表。
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <DatePicker
                        label="選擇日期"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        format="YYYY-MM-DD"
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFetchReport}
                        disabled={isLoading}
                        startIcon={<AssessmentIcon />}
                    >
                        產生報告
                    </Button>
                </Box>

                {isLoading && (
                    <Box display="flex" justifyContent="center" my={5}>
                        <CircularProgress />
                    </Box>
                )}
                
                {error && (
                    <Alert severity="warning" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                {report && (
                    <NutritionReport report={report} />
                )}
            </Container>
        </LocalizationProvider>
    );
}

export default AnalysisPage;
