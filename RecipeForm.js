import React, { useState, useEffect } from 'react';
import { createRecipe, updateRecipe } from '../services/api';

// 初始表單狀態
const initialFormData = {
    name: '',
    type: 'lunch', // 預設值
    ingredients: [],
    allergens: [],
    nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    }
};

// 為了方便，定義一些簡單的樣式
const styles = {
    form: { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' },
    label: { fontWeight: 'bold', display: 'block', marginTop: '15px' },
    input: { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '8px', marginTop: '5px' },
    button: { padding: '10px 20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' },
    cancelButton: { marginLeft: '10px', backgroundColor: '#6c757d'},
    dynamicList: { listStyle: 'none', padding: 0 },
    dynamicListItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', border: '1px solid #eee', marginTop: '5px' },
    removeButton: { cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px 8px' }
};

function RecipeForm({ recipeToEdit, onFormSubmitSuccess, onCancel }) {
    const [formData, setFormData] = useState(initialFormData);
    const [newItem, setNewItem] = useState({ ingredient: '', allergen: '' });

    // 判斷目前是編輯模式還是新增模式
    const isEditMode = Boolean(recipeToEdit);

    useEffect(() => {
        // 如果傳入了 recipeToEdit，代表是編輯模式，用它的資料填充表單
        if (isEditMode) {
            setFormData({
                name: recipeToEdit.name || '',
                type: recipeToEdit.type || 'lunch',
                ingredients: recipeToEdit.ingredients || [],
                allergens: recipeToEdit.allergens || [],
                nutrition: recipeToEdit.nutrition || initialFormData.nutrition
            });
        } else {
            // 否則，重設為初始狀態 (新增模式)
            setFormData(initialFormData);
        }
    }, [recipeToEdit, isEditMode]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNutritionChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            nutrition: { ...prev.nutrition, [name]: Number(value) }
        }));
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    // 動態新增項目 (食材或過敏原)
    const handleAddItem = (itemType) => {
        const value = newItem[itemType].trim();
        if (value && !formData[itemType + 's'].includes(value)) {
            setFormData(prev => ({
                ...prev,
                [itemType + 's']: [...prev[itemType + 's'], value]
            }));
            setNewItem(prev => ({ ...prev, [itemType]: '' })); // 清空輸入框
        }
    };

    // 動態移除項目 (食材或過敏原)
    const handleRemoveItem = (itemType, index) => {
        setFormData(prev => ({
            ...prev,
            [itemType + 's']: prev[itemType + 's'].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateRecipe(recipeToEdit._id, formData);
            } else {
                await createRecipe(formData);
            }
            alert(`食譜已成功${isEditMode ? '更新' : '建立'}！`);
            if (onFormSubmitSuccess) {
                onFormSubmitSuccess(); // 呼叫父組件傳入的 callback
            }
        } catch (error) {
            console.error('提交失敗:', error);
            alert('操作失敗，請檢查主控台錯誤訊息。');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{isEditMode ? '編輯食譜' : '建立新食譜'}</h2>

            <label style={styles.label}>食譜名稱:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />

            <label style={styles.label}>類型:</label>
            <select name="type" value={formData.type} onChange={handleChange} style={styles.select}>
                <option value="breakfast">早餐</option>
                <option value="lunch">午餐</option>
                <option value="dinner">晚餐</option>
                <option value="snack">點心</option>
            </select>

            {/* 動態食材列表 */}
            <label style={styles.label}>食材:</label>
            <ul style={styles.dynamicList}>
                {formData.ingredients.map((ing, index) => (
                    <li key={index} style={styles.dynamicListItem}>
                        <span>{ing}</span>
                        <button type="button" onClick={() => handleRemoveItem('ingredient', index)} style={styles.removeButton}>移除</button>
                    </li>
                ))}
            </ul>
            <div>
                <input type="text" name="ingredient" placeholder="新增食材" value={newItem.ingredient} onChange={handleNewItemChange} style={{...styles.input, width: '70%', display: 'inline-block'}} />
                <button type="button" onClick={() => handleAddItem('ingredient')} style={{...styles.button, marginTop: '5px', marginLeft: '10px'}}>加入</button>
            </div>


            {/* 營養成分 */}
            <label style={styles.label}>營養成分:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="number" name="calories" placeholder="熱量 (大卡)" value={formData.nutrition.calories} onChange={handleNutritionChange} style={styles.input} />
                <input type="number" name="protein" placeholder="蛋白質 (克)" value={formData.nutrition.protein} onChange={handleNutritionChange} style={styles.input} />
                <input type="number" name="carbs" placeholder="碳水化合物 (克)" value={formData.nutrition.carbs} onChange={handleNutritionChange} style={styles.input} />
                <input type="number" name="fat" placeholder="脂肪 (克)" value={formData.nutrition.fat} onChange={handleNutritionChange} style={styles.input} />
            </div>

             {/* 動態過敏原列表 */}
            <label style={styles.label}>過敏原:</label>
             <ul style={styles.dynamicList}>
                {formData.allergens.map((alg, index) => (
                    <li key={index} style={styles.dynamicListItem}>
                        <span>{alg}</span>
                        <button type="button" onClick={() => handleRemoveItem('allergen', index)} style={styles.removeButton}>移除</button>
                    </li>
                ))}
            </ul>
            <div>
                 <input type="text" name="allergen" placeholder="新增過敏原 (例如: 花生、麩質)" value={newItem.allergen} onChange={handleNewItemChange} style={{...styles.input, width: '70%', display: 'inline-block'}} />
                 <button type="button" onClick={() => handleAddItem('allergen')} style={{...styles.button, marginTop: '5px', marginLeft: '10px'}}>加入</button>
            </div>


            <button type="submit" style={styles.button}>{isEditMode ? '更新食譜' : '建立食譜'}</button>
            {onCancel && <button type="button" onClick={onCancel} style={{...styles.button, ...styles.cancelButton}}>取消</button>}
        </form>
    );
}

export default RecipeForm;
