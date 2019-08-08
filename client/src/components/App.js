import React from 'react';
import Recipes from './Recipes';
import RecipeDetails from './RecipeDetails';

import { Router } from '@reach/router';

class App extends React.Component {
  state = {
    recipes: [],
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes,
        }),
      );
  }

  render() {
    return (
      <div>
        <Router>
          <Recipes path="/" recipes={this.state.recipes} />
          <RecipeDetails path="/recipe/:recipeId" />
        </Router>
      </div>
    );
  }
}

export default App;
