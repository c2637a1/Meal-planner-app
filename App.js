import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage'; // 假設您已將食譜頁面模組化
import AnalysisPage from './pages/AnalysisPage';

// MUI Components
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 建立一個簡單的主題
const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // 綠色系
        },
        secondary: {
            main: '#ff9100', // 橘色系
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            🍱 Meal Planner
                        </Typography>
                        <Button color="inherit" component={Link} to="/recipes">
                            食譜管理
                        </Button>
                        <Button color="inherit" component={Link} to="/analysis">
                            營養分析
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container component="main" sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<RecipesPage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/analysis" element={<AnalysisPage />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
