import React, { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../services/api';

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    // 假設使用者的過敏原
    const userAllergies = ['nuts', 'shellfish']; 

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        const response = await getRecipes();
        setRecipes(response.data);
    };

    const handleDelete = async (id) => {
        await deleteRecipe(id);
        fetchRecipes(); // 重新整理列表
    };

    const hasAllergy = (recipeAllergens) => {
        if (!recipeAllergens) return false;
        return recipeAllergens.some(allergen => userAllergies.includes(allergen.toLowerCase()));
    };

    return (
        <div>
            <h2>食譜列表</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id} style={{ color: hasAllergy(recipe.allergens) ? 'red' : 'black' }}>
                        {recipe.name} ({recipe.type})
                        {/* 過敏提醒 */}
                        {hasAllergy(recipe.allergens) && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>(含過敏原!)</span>}
                        <button onClick={() => handleDelete(recipe._id)} style={{ marginLeft: '20px' }}>刪除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecipeList;
