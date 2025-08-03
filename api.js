import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // 後端伺服器位址

const api = axios.create({
    baseURL: API_URL
});

// 食譜 API
export const getRecipes = () => api.get('/recipes');
export const createRecipe = (data) => api.post('/recipes', data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const getRandomRecipe = () => api.get('/recipes/random');

// 分析 API
export const logMeal = (data) => api.post('/analysis/log', data);
export const getAnalysisReport = (date) => api.get(`/analysis/report/${date}`);

export default api;
