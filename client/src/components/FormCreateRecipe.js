import React from "react";

const FormCreateRecipe = ({ addRecipe }) => {
  const [values, setValues] = React.useState({
    title: "Recipe Title",
    image: "toast.png",
    description: "Description of the recipe",
    ingredients: ["ham", "cheese"],
  });

  const createRecipe = (event) => {
    event.preventDefault();
    const recipe = {
      title: values.title,
      image: values.image,
      description: values.description,
      ingredients: values.ingredients,
    };
    addRecipe(recipe);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(" name ", name);
    setValues({ ...values, [name]: value });
  };

  return (
    <div>
      <h2>Add Recipe Form</h2>
      <form onSubmit={createRecipe}>
        <input
          type="text"
          placeholder="Recipe title"
          value={values.title}
          name="title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Recipe image"
          value={values.image}
          name="image"
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Recipe description"
          name="description"
          onChange={handleInputChange}
          value={values.description}
        />
        <h3>Ingredients</h3>
        <input
          type="text"
          placeholder="Recipe ingredient"
          value={values.ingredients[0]}
          name="ingredient"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Recipe ingredient"
          value={values.ingredients[1]}
          name="ingredient"
          onChange={handleInputChange}
        />
        <button>+</button>
        <hr />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default FormCreateRecipe;
