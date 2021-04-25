import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import Nav from "./Nav";
import { useFetch } from "../hooks/useFetch";

function App() {
  const { loading, data: recipes, error, setData } = useFetch(`/api/recipes`);
  const [loggedin, setLoggedin] = React.useState(true);

  const addRecipe = (recipe) => {
    console.log("bar:", recipe);
    fetch(`/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(" FOO:: ", data);
        setData(recipe);
      })
      .catch((error) => console.log(error));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Router>
        <Nav setLoggedin={setLoggedin} loggedin={loggedin} />
        <Switch>
          <Route exact path="/">
            <Recipes
              recipes={recipes}
              loggedin={loggedin}
              addRecipe={addRecipe}
            />
          </Route>
          <Route path="/:recipeId">
            <RecipeDetail />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
