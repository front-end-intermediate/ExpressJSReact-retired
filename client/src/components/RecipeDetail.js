import React from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const [recipe, setRecipe] = React.useState({
    title: "",
    description: "",
    image: "toast.png",
    ingredients: [],
    preparation: [],
  });

  const [loading, setLoading] = React.useState(false);
  const { recipeId } = useParams();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((json) => {
        setRecipe(json);
        setLoading(false);
      })
      .catch((err) => console.warn(err));
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

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
