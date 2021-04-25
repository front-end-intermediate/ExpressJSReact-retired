import React from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import FormCreateRecipe from "./FormCreateRecipe";

function RecipeDetail() {
  const { recipeId } = useParams();
  const { loading, data: recipe, error } = useFetch(`/api/recipes/${recipeId}`);

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div key={recipe._id}>
      <img src={`/img/${recipe.image}`} alt={recipe.title} />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h3>Preparation</h3>
      <ul>
        {recipe.preparation.map((prep) => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul>
      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
