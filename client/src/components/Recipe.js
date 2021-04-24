import React from "react";
import { Link } from "react-router-dom";

function Recipe(props) {
  const { _id, title, name, description, image } = props.recipe;

  return (
    <>
      <img src={`/img/${image}`} alt={name} />
      <h3>
        <Link to={`/${_id}`}>{title}</Link>
      </h3>
      <p>{description}</p>
    </>
  );
}

export default Recipe;
