import React from "react";

import { Link } from "react-router-dom";

const Nav = ({ loggedin, setLoggedin }) => {
  return (
    <nav>
      <h1>
        <Link to="/">Recipes</Link>
      </h1>

      {loggedin ? (
        <button onClick={() => setLoggedin(false)}>Log Out {loggedin}</button>
      ) : (
        <button onClick={() => setLoggedin(true)}>Log In {loggedin}</button>
      )}
    </nav>
  );
};

export default Nav;
