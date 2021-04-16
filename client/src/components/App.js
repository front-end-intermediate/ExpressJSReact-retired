import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useState(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <div>
      <p>Hello from App</p>
    </div>
  );
}

export default App;
