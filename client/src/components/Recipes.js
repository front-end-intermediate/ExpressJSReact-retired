import React from 'react'
import Recipe from './Recipe'
import FormCreateRecipe from './FormCreateRecipe'

function Recipes({ recipes, loggedin, addRecipe }) {
    return (
        <div>
            {loggedin ? <FormCreateRecipe addRecipe={addRecipe} /> : ''}
            {recipes.map((recipe) => (
                <Recipe key={recipe._id} recipe={recipe} />
            ))}
        </div>
    )
}

export default Recipes
