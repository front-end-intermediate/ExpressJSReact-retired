# Express and React

- [Express and React](#express-and-react)
  - [Homework](#homework)
  - [Create a React project:](#create-a-react-project)
  - [The First Component](#the-first-component)
  - [Component Lifecycle](#component-lifecycle)
  - [CORS](#cors)
  - [Multiple Components](#multiple-components)
  - [Single Page Routing](#single-page-routing)
  - [Recipe Details](#recipe-details)
  - [ADDITIONS](#additions)
  - [Adding a NavBar](#adding-a-navbar)
  - [Another State](#another-state)
  - [react-icons](#react-icons)
  - [Notes](#notes)
  - [Editing a Recipe](#editing-a-recipe)

## Homework

You should continue to build out the details component.

This project is a template for your final project which **must** include an Express API as well as a font end written in React.

## Create a React project:

`npx create-react-app client`

We could run the client by cd'ing into it but then we would have to run the server in a separate tab.

Install npm concurrently as dev dependency

`npm i -D concurrently`

Edit the package.json scripts:

```sh
"client": "npm start --prefix client",
"dev": "concurrently \"npm run server\" \"npm run client\""
```

Change the PORT in `.env` to 5000.

cd into the root and run `npm run dev`.

Note: any React specific npm installs need to be done in the client folder.

Proxy in client package.json:

`"proxy": "http://localhost:5000"`

Clean up files in client.

## The First Component

index.js:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5001/api/recipes`)
      .then(response => response.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <div>
        <p>Hello</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## Component Lifecycle

index.js:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes
        })
      );
  }

  render() {
    return (
      <div>
        {this.state.recipes.map(recipe => (
          <Recipe key={recipe._id} recipe={recipe} />
        ))}
      </div>
    );
  }
}

class Recipe extends React.Component {
  render() {
    return <p>{this.props.recipe.title}</p>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## CORS

CORs. In `server.js`:

```js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
```

## Multiple Components

Create a components folder in src and break the App and Recipe components into separate files.

Scaffold the Recipe component.

```js
import React from 'react';

class Recipe extends React.Component {
  render() {
    const {
      title,
      description,
      image,
      ingredients,
      preparation
    } = this.props.recipe;
    return (
      <>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={this.props.recipe.name}
        />
        <h3>{title}</h3>
        <p>{description}</p>
        <h4>Ingredients</h4>
        <ul>
          {ingredients.map(ingredient => (
            <li>{ingredient}</li>
          ))}
        </ul>
        <h4>Preparation</h4>
        <ul>
          {preparation.map(prep => (
            <li>{prep.step}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default Recipe;
```

Copy the CSS from the vanillajs public folder into index.css.

## Single Page Routing

Import reach router and import the router into App:

```js
import React from 'react';
import { Router } from '@reach/router';
import Recipes from './Recipes';
import RecipeDetail from './RecipeDetail';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes
        })
      );
  }

  render() {
    return (
      <div>
        <h1>Recipes!</h1>
        <Router>
          <Recipes path='/' recipes={this.state.recipes} />
          <RecipeDetail path='/recipe/:recipeId' recipes={this.state.recipes} />
        </Router>
      </div>
    );
  }
}

export default App;
```

Create a Recipes component

```js
import React from 'react';
import Recipe from './Recipe';

class Recipes extends React.Component {
  render() {
    const { recipes } = this.props;
    console.log(recipes);
    return (
      <div>
        {recipes.map(recipe => (
          <Recipe key={recipe._id} recipe={recipe} />
        ))}
      </div>
    );
  }
}

export default Recipes;
```

Edit the Recipe component:

```js
import React from 'react';
import { Link } from '@reach/router';

class Recipe extends React.Component {
  render() {
    const {
      _id,
      title,
      description,
      image,
      ingredients,
      preparation
    } = this.props.recipe;
    return (
      <>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={this.props.recipe.name}
        />
        <h3>
          <Link to={`/recipe/${_id}`}>{title}</Link>
        </h3>
        <p>{description}</p>
        <h4>Ingredients</h4>
        <ul>
          {ingredients.map(ingredient => (
            <li>{ingredient}</li>
          ))}
        </ul>
        <h4>Preparation</h4>
        <ul>
          {preparation.map(prep => (
            <li>{prep.step}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default Recipe;
```

The Recipe items will link to a new RecipeDetail component:

```js
import React from 'react';
import { Link } from '@reach/router';

class RecipeDetail extends React.Component {
  render() {
    const { recipeId } = this.props;
    return (
      <div>
        <h1>{recipeId}</h1>
      </div>
    );
  }
}

export default RecipeDetail;
```

Edit the Recipe component to remove the details:

```js
import React from 'react';
import { Link } from '@reach/router';

class Recipe extends React.Component {
  render() {
    const {
      _id,
      title,
      description,
      image,
      ingredients,
      preparation
    } = this.props.recipe;
    return (
      <>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={this.props.recipe.name}
        />
        <h3>
          <Link to={`/recipe/${_id}`}>{title}</Link>
        </h3>
        <p>{description}</p>
      </>
    );
  }
}

export default Recipe;
```

## Recipe Details

Build out the RecipeDetail component:

```js
import React from 'react';
import { Link } from '@reach/router';

class RecipeDetail extends React.Component {
  state = {
    recipe: {}
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe: recipe
        })
      );
  }

  render() {
    const {
      _id,
      title,
      description,
      image,
      ingredients,
      preparation
    } = this.state.recipe;
    console.log(ingredients);
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
        {ingredients}
      </div>
    );
  }
}

export default RecipeDetail;
```

```js
return (
  <div>
    <pre>{JSON.stringify(this.state.recipe, null, 2)}</pre>
  </div>
);
```

To illustrate some issues with the buildout of RecipeDetail:

```js
import React from 'react';

class RecipeDetail extends React.Component {
  state = {
    recipe: {},
    loading: false
    // ingredients: ['4', '5'],
  };

  componentDidMount() {
    this.setState({ loading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe: recipe,
          loading: false
          // ingredients: recipe.ingredients
        })
      );
    // this.state.loading = false;
  }

  render() {
    if (this.state.loading) return 'Loading...';

    const {
      title,
      description,
      image,
      ingredients,
      preparation
    } = this.state.recipe;

    return (
      <div>
        <pre>{JSON.stringify(this.state.recipe, null, 2)}</pre>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={title}
        />
        <h3>{title}</h3>
        <p>{description}</p>
        <h4>Ingredients</h4>
        {ingredients && ingredients.map(item => <p key={item}>{item}</p>)}
        <h4>Preparation</h4>
        {preparation &&
          preparation.map(prep => <p key={prep.step}>{prep.step}</p>)}
      </div>
    );
  }
}

export default RecipeDetail;
```

One solution:

```js
import React from 'react';

class RecipeDetail extends React.Component {
  state = {
    recipe: {},
    loading: false,
    ingredients: [],
    preparation: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe,
          loading: false,
          ingredients: recipe.ingredients,
          preparation: recipe.preparation
        })
      );
  }

  render() {
    if (this.state.loading) return 'Loading...';

    const { title, description, image } = this.state.recipe;

    const { ingredients, preparation } = this.state;

    return (
      <div>
        <img
          src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
          alt={title}
        />
        <h3>{title}</h3>
        <p>{description}</p>
        <h4>Ingredients</h4>
        <ul>
          {ingredients.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>Preparation</h4>
        <ul>
          {preparation.map(prep => (
            <li key={prep.step}>{prep.step}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default RecipeDetail;
```

## ADDITIONS

A graceful shutdown for ExpressJS:

```js
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('graceful shutdown express');
  server.close(function() {
    console.log('closed express');
  });
}

const server = app.listen(PORT, () =>
  console.log(`Server running at port ${PORT}`)
);
```

Add a component to allow the centralization of maintenance functions.

RecipeMaintenance.js:

```js
import React, { Component } from 'react';

class RecipeMaintenance extends Component {
  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form>
          <input type='text' placeholder='Recipe name' />
          <input type='text' placeholder='Recipe image' />
          <textarea type='text' placeholder='Recipe description' />
          <button type='submit'>Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Import the component into App.js and add it to the routing scheme.

```js
<Router>
  <Recipes path='/' recipes={this.state.recipes} />
  <RecipeDetails path='/recipe/:recipeId' />
  <RecipeMaintenance path='/maintenance' />
</Router>
```

Test the path in the browser.

Add onSubmit and createRecipe:

```js
import React, { Component } from 'react';

class RecipeMaintenance extends Component {
  createRecipe(e) {
    e.preventDefault();
    console.log('making a recipe');
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={e => this.createRecipe(e)}>
          <input type='text' placeholder='Recipe name' />
          <input type='text' placeholder='Recipe image' />
          <textarea type='text' placeholder='Recipe description' />
          <button type='submit'>Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Test the button.

Outfit the form with refs:

```js
import React, { Component } from 'react';

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    console.log('making a recipe');
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={e => this.createRecipe(e)}>
          <input
            type='text'
            name='name'
            placeholder='Recipe name'
            ref={this.nameRef}
          />
          <input
            type='text'
            name='image'
            placeholder='Recipe image'
            ref={this.imageRef}
          />
          <textarea
            type='text'
            name='description'
            placeholder='Recipe description'
            ref={this.descriptionRef}
          />
          <button type='submit'>Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Complete the createRecipe function:

```js
import React, { Component } from 'react';

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      name: this.nameRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value
    };
    this.props.addRecipe(recipe);
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={e => this.createRecipe(e)}>
          <input
            type='text'
            name='name'
            placeholder='Recipe name'
            ref={this.nameRef}
          />
          <input
            type='text'
            name='image'
            placeholder='Recipe image'
            ref={this.imageRef}
          />
          <textarea
            type='text'
            name='description'
            placeholder='Recipe description'
            ref={this.descriptionRef}
          />
          <button type='submit'>Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Add the addRecipe function to App.js and send it as a prop to RecipeMaintenance:

```js
import React from 'react';
import Recipes from './Recipes';
import RecipeDetails from './RecipeDetails';
import RecipeMaintenance from './RecipeMaintenance';

import { Router } from '@reach/router';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes
        })
      );
  }

  addRecipe = recipe => {
    console.log(recipe);
  };

  render() {
    return (
      <div>
        <Router>
          <Recipes path='/' recipes={this.state.recipes} />
          <RecipeDetails path='/recipe/:recipeId' />
          <RecipeMaintenance path='/maintenance' addRecipe={this.addRecipe} />
        </Router>
      </div>
    );
  }
}

export default App;
```

Collect the state using a spread operator and log that to the console:

```js
import React from 'react';
import Recipes from './Recipes';
import RecipeDetails from './RecipeDetails';
import RecipeMaintenance from './RecipeMaintenance';

import { Router } from '@reach/router';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes
        })
      );
  }

  addRecipe = recipe => {
    const recipes = [...this.state.recipes];
    console.log(recipes);
  };

  render() {
    return (
      <div>
        <Router>
          <Recipes path='/' recipes={this.state.recipes} />
          <RecipeDetails path='/recipe/:recipeId' />
          <RecipeMaintenance path='/maintenance' addRecipe={this.addRecipe} />
        </Router>
      </div>
    );
  }
}

export default App;
```

Expand the function to use our api. Note the fetch options:

```js
addRecipe = recipe => {
  console.log(recipe);
  fetch(`http://localhost:5000/api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
    .then(response => response.json())
    .then(recipe => console.log(recipe));
};
```

Test the form.

Ooops, wrong name. Swap name for title:

```js
import React, { Component } from 'react';

class RecipeMaintenance extends Component {
  titleRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      title: this.titleRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value
    };
    this.props.addRecipe(recipe);
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={e => this.createRecipe(e)}>
          <input
            type='text'
            name='title'
            placeholder='Recipe name'
            ref={this.titleRef}
          />
          <input
            type='text'
            name='image'
            placeholder='Recipe image'
            ref={this.imageRef}
          />
          <textarea
            type='text'
            name='description'
            placeholder='Recipe description'
            ref={this.descriptionRef}
          />
          <button type='submit'>Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

## Adding a NavBar

Create a Home Link.

App.js:

```js
render() {
  return (
    <>
      <nav>
        <Link to='/'>Home</Link>
      </nav>
      <Router>
        <Recipes path='/' recipes={this.state.recipes} />
        <RecipeDetails path='/recipe/:recipeId' />
        <RecipeMaintenance path='/maintenance' addRecipe={this.addRecipe} />
      </Router>
    </>
  );
```

Don't forget to import Link from reach router.

Create some css to support the new element:

css:

```css
nav {
  min-height: 3rem;
  background-color: #007eb6;
  margin-bottom: 1rem;
  display: flex;
  align-content: center;
}
nav a {
  color: #fff;
  padding: 1rem;
}
```

Add a link to Maintenance:

```js
<nav>
  <Link to='/'>Home</Link> <Link to='/maintenance'>Maintenance</Link>
</nav>
```

Adding delete to RecipeMaintenance:

```js
import React, { Component } from 'react';

class ListRecipes extends Component {
  handleDelete(id) {
    fetch(`http://localhost:5000/api/recipes/${id}`, {
      method: 'DELETE'
    }).then(response => console.log(response));
  }

  render() {
    return (
      <ul>
        {this.props.recipes.map(recipe => (
          <li>
            {recipe.title}{' '}
            <button onClick={() => this.handleDelete(recipe._id)}>X</button>
          </li>
        ))}
      </ul>
    );
  }
}

class RecipeMaintenance extends Component {
  titleRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      title: this.titleRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value
    };
    this.props.addRecipe(recipe);
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={e => this.createRecipe(e)}>
          <input
            type='text'
            name='title'
            placeholder='Recipe name'
            ref={this.titleRef}
          />
          <input
            type='text'
            name='image'
            placeholder='Recipe image'
            ref={this.imageRef}
          />
          <textarea
            type='text'
            name='description'
            placeholder='Recipe description'
            ref={this.descriptionRef}
          />
          <button type='submit'>Add Recipe</button>
        </form>
        <ListRecipes recipes={this.props.recipes} />
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Be sure to pass the recipes to the component from App.js:

```js
<RecipeMaintenance
  path='/maintenance'
  addRecipe={this.addRecipe}
  recipes={this.state.recipes}
/>
```

## Another State

Lifting state up and the 'this' keyword.

See [this](https://github.com/front-end-summer19/React-Intro#extending-classes)

Add a constructor to App.js and create the handleDelete function:

```js
import React from 'react';
import Recipes from './Recipes';
import RecipeDetails from './RecipeDetails';
import RecipeMaintenance from './RecipeMaintenance';

import { Router, Link } from '@reach/router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(recipes =>
        this.setState({
          recipes: recipes
        })
      );
  }

  addRecipe = recipe => {
    console.log(recipe);
    fetch(`http://localhost:5000/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    })
      .then(response => response.json())
      .then(recipe => console.log(recipe));
  };

  handleDelete(id) {
    console.log(this.state);
    console.log(id);

    fetch(`http://localhost:5000/api/recipes/${id}`, {
      method: 'DELETE'
    });
    const recipes = [...this.state.recipes];
    recipes.splice(id, 1);
    this.setState({ recipes: recipes });
  }

  render() {
    return (
      <>
        <nav>
          <Link to='/'>Home</Link> <Link to='/maintenance'>Maintenance</Link>
        </nav>
        <Router>
          <Recipes path='/' recipes={this.state.recipes} />
          <RecipeDetails path='/recipe/:recipeId' />
          <RecipeMaintenance
            path='/maintenance'
            addRecipe={this.addRecipe}
            recipes={this.state.recipes}
            handleDelete={this.handleDelete}
          />
        </Router>
      </>
    );
  }
}

export default App;
```

and

```js
<ListRecipes
  recipes={this.props.recipes}
  handleDelete={this.props.handleDelete}
/>
```

Update the addRecipe function in App.js:

```js
addRecipe = recipe => {
  this.setState({ isLoading: true });
  fetch(`http://localhost:5000/api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
    .then(response => response.json())
    .then(recipe => console.log(recipe));
  const recipes = [...this.state.recipes];
  recipes.unshift(recipe);
  this.setState({ recipes: recipes, isLoading: false });
};
```

Test deleting a recipe.

## react-icons

npm install react-icons and use them in the maintenance interface:

```js
import React, { Component } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

class ListRecipes extends Component {
  render() {
    return (
      <ul>
        {this.props.recipes.map(recipe => (
          <li key={recipe._id}>
            {recipe.title}{' '}
            <button
              style={{ backgroundColor: 'transparent' }}
              onClick={() => this.props.handleDelete(recipe._id)}
            >
              <FaTimesCircle color='rgb(194, 57, 42)' size={20} />
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
```

Note the use of inline css.

Try removing the border:

`style={{ backgroundColor: 'transparent', border: 'none' }}`

## Notes

## Editing a Recipe

EditRecipe.js:

```js
import React from 'react';

class EditRecipe extends React.Component {
  state = {
    recipe: [],
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeid}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe: recipe,
          isLoading: false
        })
      );
  }

  render() {
    return (
      <div>
        <h3>EDIT RECIPE</h3>
        {this.state.recipe.title}
      </div>
    );
  }
}

export default EditRecipe;
```

Add a link in maintenance:

```js
class ListRecipes extends Component {
  render() {
    return (
      <ul>
        {this.props.recipes.map(recipe => (
          <li key={recipe._id}>
            <Link to={`/editrecipe/${recipe._id}`}>{recipe.title}</Link>{' '}
            <button
              style={{ backgroundColor: 'transparent', border: 'none' }}
              onClick={() => this.props.handleDelete(recipe._id)}
            >
              <FaTimesCircle color='rgb(194, 57, 42)' size={20} />
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
```

Expand edit form:

```js
import React from 'react';

class EditRecipe extends React.Component {
  state = {
    recipe: [],
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          recipe: recipe,
          isLoading: false
        })
      );
  }

  handleSubmit() {
    return false;
  }

  render() {
    return (
      <div>
        <h3>EDIT RECIPE</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            placeholder='Recipe Title'
            name='title'
            value={this.state.recipe.title}
          />
          <input
            type='text'
            placeholder='Image'
            name='image'
            value={this.state.recipe.image}
          />
          <textarea
            type='text'
            placeholder='Description'
            name='description'
            value={this.state.recipe.description}
          />
          <button>Update</button>
        </form>
      </div>
    );
  }
}

export default EditRecipe;
```
