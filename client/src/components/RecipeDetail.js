import React from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../hooks/useFetch";

function RecipeDetail({ loggedin, deleteRecipe }) {
  const { get } = useApi();
  const { recipeId } = useParams();
  const [recipe, setRecipe] = React.useState({
    title: "",
    description: "",
    image: "toast.png",
    ingredients: [],
    preparation: [],
  });

  React.useEffect(() => {
    get(`api/recipes/${recipeId}`).then((data) => {
      setRecipe(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
      {loggedin ? (
        <button onClick={() => deleteRecipe(recipe._id)}>delete</button>
      ) : (
        ""
      )}

      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
