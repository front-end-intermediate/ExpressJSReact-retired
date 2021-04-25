import React from "react";

const FormCreateRecipe = () => {
  const [values, setValues] = React.useState({
    title: "Recipe Title",
    image: "toast.png",
    description: "Description of the recipe",
  });

  const createRecipe = (event) => {
    event.preventDefault();
    console.log("making a recipe");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(" name ", name);
    setValues({ ...values, [name]: value });
  };

  return (
    <div>
      <h3>Add Recipe Form</h3>
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

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default FormCreateRecipe;
