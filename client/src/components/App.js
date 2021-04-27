import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import Nav from "./Nav";
import { useApi } from "../hooks/useFetch";

function App() {
  const { get, post, del } = useApi();
  const [recipes, setRecipes] = React.useState([]);
  const [recipe, setRecipe] = React.useState(null);
  const [loggedin, setLoggedin] = React.useState(true);

  React.useEffect(() => {
    get("/api/recipes").then((data) => {
      setRecipes(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  const addRecipe = (recipe) => {
    post("/api/recipes", recipe).then((data) => {
      setRecipe(data);
    });
  };

  const deleteRecipe = (recipeId) => {
    del(`/api/recipes/${recipeId}`).then(window.location.replace("/"));
  };

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
            <RecipeDetail loggedin={loggedin} deleteRecipe={deleteRecipe} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
