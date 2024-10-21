import React, { useState } from 'react';
import axios from 'axios';

const CategoryManager = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');

  const addNewCategory = async () => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
        alert('Please enter a valid category.');
        return;
    }

    // Check if the category already exists
    if (categories.some(cat => cat.name.toLowerCase() === trimmedCategory.toLowerCase())) {
        alert('Category already exists.');
        return;
    }

    try {
        // Make the API request to add the new category
        const response = await axios.post('http://localhost:5000/api/categories', { name: trimmedCategory });

        // Update the categories list with the new category from the API response
        setCategories([...categories, response.data]);

        // Clear the input field after adding the category
        setNewCategory('');
    } catch (error) {
        // Log the error to the console and display a user-friendly message
        console.error('Error adding category:', error);
        alert('Failed to add category. Please try again.');
    }
};


  return (
    <div>
      <h3>Add New Category</h3>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New Category"
        style={{ padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={addNewCategory} style={{ padding: '10px', backgroundColor: '#36A2EB', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Add Category
      </button>
    </div>
  );
};

export default CategoryManager;
