import React from 'react';
import { Link } from '@reach/router';

export class Recipe extends React.Component {
  render() {
    const { _id, title, description, image } = this.props.recipe;
    return (
      <div>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={title}
        />

        <Link to={`/recipe/${_id}`}>
          <h3>{title}</h3>
        </Link>

        <p>{description}</p>
      </div>
    );
  }
}

export default Recipe;
