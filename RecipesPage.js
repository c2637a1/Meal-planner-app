import React, { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../services/api';

// 自訂元件
import RecipeList from '../components/RecipeList';
import RecipeForm from '../components/RecipeForm';
import ConfirmDialog from '../components/ConfirmDialog';

// MUI Components
import { Container, Typography, Box, Button, Dialog, DialogTitle, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [recipeIdToDelete, setRecipeIdToDelete] = useState(null);

    // 狀態管理
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // 初始載入食譜
    const fetchRecipes = async () => {
        try {
            const response = await getRecipes();
            setRecipes(response.data);
        } catch (error) {
            showSnackbar('無法載入食譜列表', 'error');
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // 開啟/關閉 Snackbar 的輔助函式
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // 表單處理
    const handleAddNew = () => {
        setRecipeToEdit(null);
        setIsFormOpen(true);
    };

    const handleEdit = (recipe) => {
        setRecipeToEdit(recipe);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        showSnackbar(`食譜已成功${recipeToEdit ? '更新' : '建立'}！`, 'success');
        fetchRecipes();
    };

    // 刪除流程處理
    const handleDelete = (id) => {
        setRecipeIdToDelete(id);
        setIsConfirmOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        try {
            await deleteRecipe(recipeIdToDelete);
            showSnackbar('食譜已成功刪除', 'success');
            fetchRecipes();
        } catch (error) {
            showSnackbar('刪除失敗', 'error');
        } finally {
            setIsConfirmOpen(false);
            setRecipeIdToDelete(null);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    食譜管理
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                >
                    新增食譜
                </Button>
            </Box>

            <RecipeList recipes={recipes} onEdit={handleEdit} onDelete={handleDelete} />

            {/* 新增/編輯表單的 Dialog */}
            <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
                <RecipeForm
                    recipeToEdit={recipeToEdit}
                    onFormSubmitSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                />
            </Dialog>

            {/* 刪除確認的 Dialog */}
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="確認刪除"
                message="您確定要刪除這篇食譜嗎？此操作無法復原。"
            />

            {/* 操作結果通知 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default RecipesPage;

