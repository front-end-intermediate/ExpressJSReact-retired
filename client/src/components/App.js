import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import Nav from "./Nav";
import { useFetch } from "../hooks/useFetch";

function App() {
  const { loading, data: recipes, error } = useFetch(`/api/recipes`);
  const [loggedin, setLoggedin] = React.useState(true);

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
            <Recipes recipes={recipes} loggedin={loggedin} />
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
