import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, IconButton, Chip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import WarningIcon from '@mui/icons-material/Warning';

// 假設使用者的過敏原，在真實應用中應來自使用者狀態
const userAllergies = ['花生', '麩質'];

function RecipeList({ recipes, onEdit, onDelete }) {

    if (!recipes || recipes.length === 0) {
        return (
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 5 }}>
                還沒有任何食譜，點擊右上角的「新增食譜」來建立你的第一篇食譜吧！
            </Typography>
        );
    }
    
    const hasAllergy = (recipeAllergens = []) => {
        return recipeAllergens.some(allergen => userAllergies.includes(allergen));
    };

    return (
        <Grid container spacing={3}>
            {recipes.map((recipe) => (
                <Grid item key={recipe._id} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            {hasAllergy(recipe.allergens) && (
                                <Chip 
                                  icon={<WarningIcon />} 
                                  label="含過敏原!" 
                                  color="error" 
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                            )}
                            <Typography variant="h5" component="div">
                                {recipe.name}
                            </Typography>
                            <Chip 
                                icon={<RestaurantMenuIcon />} 
                                label={recipe.type} 
                                variant="outlined" 
                                size="small"
                                sx={{ my: 1 }}
                            />
                            <Typography sx={{ mt: 1.5 }} color="text.secondary">
                                食材:
                            </Typography>
                            <Box>
                                {recipe.ingredients.map((ing, index) => (
                                    <Chip key={index} label={ing} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                ))}
                            </Box>
                        </CardContent>
                        <CardActions>
                            <IconButton aria-label="edit" onClick={() => onEdit(recipe)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => onDelete(recipe._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default RecipeList;
