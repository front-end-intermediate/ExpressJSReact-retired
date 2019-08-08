import React from 'react';
import { Link } from '@reach/router';

class RecipeDetails extends React.Component {
  state = {
    recipe: [],
    ingredients: [],
    preparation: [],
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe: recipe,
          ingredients: recipe.ingredients,
          preparation: recipe.preparation,
        }),
      );
  }

  render() {
    const { _id, title, description, image } = this.state.recipe;

    return (
      <div>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={title}
        />
        <h3>
          <Link to={`/recipe/${_id}`}>{title}</Link>
        </h3>
        <p>{description}</p>
        <h4>Ingredients</h4>
        <ul>
          {this.state.ingredients.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>Preparation</h4>
        <ul>
          {this.state.preparation.map(prep => (
            <li key={prep.step}>{prep.step}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default RecipeDetails;
