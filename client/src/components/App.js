import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  });

  return (
    <div>
      <h1>Recipes!</h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <Recipes recipes={recipes} />
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
