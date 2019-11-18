# Express and React

Nota Bene: Today you will clone the existing [Heroku Deploy](https://github.com/front-end-intermediate/heroku-deploy) repo from Github.

<!-- https://github.com/DannyBoyNYC/session-reactClient-expressServer -->

- [Express and React](#express-and-react)
  - [Homework](#homework)
  - [Reading](#reading)
  - [Exercise: React Front End](#exercise-react-front-end)
  - [Own the Repo](#own-the-repo)
  - [Create a React project](#create-a-react-project)
  - [The First Component](#the-first-component)
  - [Aside: CORS](#aside-cors)
  - [Component Lifecycle](#component-lifecycle)
  - [Multiple Components](#multiple-components)
  - [Convert to Hooks](#convert-to-hooks)
  - [Refactoring Exercise: Code Sandbox](#refactoring-exercise-code-sandbox)
    - [Refactor to Hooks](#refactor-to-hooks)
    - [useEffect](#useeffect)
  - [Exercise Continued](#exercise-continued)
  - [Client Side Routing](#client-side-routing)
  - [fall2019-stop-here](#fall2019-stop-here)
  - [Recipe Details](#recipe-details)
  - [ADDITIONS](#additions)
  - [Adding a NavBar](#adding-a-navbar)
  - [Another State](#another-state)
  - [react-icons](#react-icons)
  - [Notes](#notes)
  - [Editing a Recipe](#editing-a-recipe)

## Homework

Convert any remaining class based components to functional components. Extend the RecipeDetail component to display ingredients and preparation details. (The notes below [this point](#fall2019-stop-here) may serve as a guide but the code samples assume a class component and have not been updated for hooks.)

Note: your final project **must** include an Express API as well as a front end written in React. You can use the [Heroku Deploy](https://github.com/front-end-intermediate/heroku-deploy) repo as a starter for your api and the material below for the front end. 

## Reading

Read and step through the [useState](https://reactjs.org/docs/hooks-state.html) and [useEffect](https://reactjs.org/docs/hooks-effect.html) documentation. You may wish to use Code Sandbox to examine the code samples.

## Exercise: React Front End

Clone the existing [Heroku Deploy](https://github.com/front-end-intermediate/heroku-deploy) repo from Github. 

```sh
cd <to your class projects directory>
git clone https://github.com/front-end-intermediate/heroku-deploy.git
cd <heroku-deploy>
```

In the [heroku-deploy](https://github.com/front-end-intermediate/heroku-deploy) reconstitute the `.env` file:

```js
NODE_ENV=development
DATABASE=mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority
PORT=3000
```

Go to [MongoDb](https://www.mongodb.com) and sign in. Find the CLuster you created and click on 'Connect' to get the connection string.

Replace the database variable in `.env` with your own. Review the Database Access and Network Access settings. Check to ensure that your IP address settings are current or set to 'all.'

npm install and run `npm run dev` to test. You should see the vanilla js site we contructed at port 300. Be sure to test the `/api/recipes` endpoint. 

You might want to install a JSON formatter for you browser.

[Chrome](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) or use [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/).

## Own the Repo

Kill the server, check the current origin, remove the origin and add a new one:

```sh
git remote -v
git remote rm origin
git remote add origin <your-new-github-repo>
git push -u origin master
```

## Create a React project

cd into the top level of the project directory and run Create React App:

`npx create-react-app client`

cd into the client folder and remove the contents of the src folder and create an initial index.js file:

```sh
$ cd client
$ rm src/*
$ touch src/index.js
```

Create a simple start page in `index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";

function HelloWorld() {
  return <div>Hello world</div>;
}

ReactDOM.render(<HelloWorld />, document.querySelector("#root"));

```

Test the new page by cd'ing into the client and running `npm start`.

We could run the client and server in a separate terminal tabs but we want an integrated application for deployment.

cd into the top level of the project (`cd ..`) and Install [concurrently](https://www.npmjs.com/package/concurrently) as a dev dependency:

`npm i -D concurrently`

Edit the package.json scripts:

```sh
"client": "npm start --prefix client",
"dev": "concurrently \"npm run server\" \"npm run client\" --kill-others "
```

Note: you'll need to set the old `dev` script to 'server':

```js
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js",
  "client": "npm start --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\" --kill-others "
},
```

Note: we are now maintaining two package.json files.

Since the Create React App front end and the server _both_ run on port 3000 we'll change the PORT in `.env` and in server.js to 5000.

In `.env`:

```js
NODE_ENV=development
DATABASE=mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority
PORT=5000
```

In `server.js`:

`const PORT = process.env.PORT || 5000;`

Set a Proxy in the React client package.json:

`"proxy": "http://localhost:5000"`

cd into the root and run `npm run dev`.

_Important_: any React specific npm installs need to be done in the client folder.

## The First Component

Create `components/App.js`:

```js
import React from 'react';
import './index.css';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <div>
        <p>Hello from App</p>
      </div>
    );
  }
}

```

Load the front end to test. Make adjustments to index.js as needed.

## Aside: CORS

I doubt we will need [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in this exercise but in the event you need them in another application you would add the following to `server.js`:

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

## Component Lifecycle

Fetch data from our API using ComponentDidMount and use a Recipe component to display them. 

App.js:

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

Since we set a proxy for the front end we could use:

```js
fetch(`/api/recipes`)
```

## Multiple Components

Exercise: Break the App and Recipe components into separate files such that index.js becomes:

```js
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(<App />, document.querySelector("#root"));
```

And renders the App component which, in tune, imports and renders the Recipe component.

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

## Convert to Hooks

First practice converting from class to function components by converting Recipe.js:

```js
import React from "react";

function Recipe(props) {
  const {
    title,
    name,
    description,
    image,
    ingredients,
    preparation
  } = props.recipe;
  return (
    <>
      <img
        src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
        alt={name}
      />
      <h3>{title}</h3>
      <p>{description}</p>
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map(ingredient => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h4>Preparation</h4>
      <ul>
        {preparation.map(prep => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul>
    </>
  );
}

export default Recipe;

```

## Refactoring Exercise: Code Sandbox

Go to `https://codesandbox.io` and create a new React sandbox.


For this exercise we wil use the Github API. 

`https://developer.github.com/v3/repos/#list-organization-repositories`

To access Facebook's repos:

`https://api.github.com/orgs/facebook/repos`

```js
import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Github extends React.Component {
  state = {
    repos: []
  };

  render() {
    return (
      <div>
        <h1>Repos</h1>
        <ul>{/* list repos here */}</ul>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Github />, rootElement);
```

Fetch the data:

```js
  componentDidMount(){
    fetch('https://api.github.com/orgs/facebook/repos')
    .then(res => res.json())
    .then(json => this.setState({repos: json}))
  }
```

Render the content:

```js
render() {
    return (
      <div>
        <h1>Repos</h1>
        <ul>
          {this.state.repos.map( repo => (
             <li key={repo.id}>{repo.full_name}</li>
          ))}
        </ul>
      </div>
    );
  }
```

Add a Loading flag:

```js
class Github extends React.Component {
  state = {
    loading: false,
    repos: []
  };

  componentDidMount(){
    this.setState({loading: true})
    fetch('https://api.github.com/orgs/facebook/repos')
    .then(res => res.json())
    .then(json => this.setState({repos: json, loading: false}))
    .catch( () => this.setState({loading: false}))
  }

  render() {
    if(this.state.loading){
      return <div>Loading repos...</div>
    }
    return (
      <div>
        <h1>Repos</h1>
        <ul>
          {this.state.repos.map( repo => (
            <li key={repo.id}>{repo.full_name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
```

### Refactor to Hooks

Import `useState` hook:

`import React, {useState} from "react";`

Create a new function under the class component:

```js
function GithubHooks(){
const [loading, setLoading] = useState(false)
const [repos, setRepos] = useState([])

  if(loading){
    return <div>Loading repos...</div>
  }

  return (
    <div>
      <h1>Repos</h1>
      <ul>
        {repos.map( repo => (
          <li key={repo.id}>{repo.full_name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Coment out the class component and render the functional component to the DOM:

`ReactDOM.render(<GithubHooks />, rootElement);`

### useEffect

Fetching the data.

Import [useEffect](https://reactjs.org/docs/hooks-effect.html) hook:

`import React, {useState, useEffect} from "react";`

Set the data with useEffect:

```js
useEffect( () => {
  setLoading(true)
  fetch('https://api.github.com/orgs/facebook/repos')
  .then(res => res.json())
  .then(json => {
    setLoading(false)
    setRepos(json)
  })
  .catch(setLoading(false));
}, [])
```

Final component

```js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function GithubHooks() {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.github.com/orgs/facebook/repos")
      .then(res => res.json())
      .then(json => {
        setLoading(false);
        setRepos(json);
      })
      .catch(setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading repos...</div>;
  }

  return (
    <div>
      <h1>Repos</h1>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>{repo.full_name}</li>
        ))}
      </ul>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<GithubHooks />, rootElement);
```

## Exercise Continued

Convert the App component to a function:

```js
import React, { useState, useEffect } from "react";
import Recipe from "./Recipe";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes`)
      .then(response => response.json())
      .then(json => {
        setRecipes(json);
      });
  });

  return (
    <div>
      {/* <pre>{JSON.stringify(this.state.recipes, null, 2)}</pre> */}
      {recipes.map(recipe => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default App;
```

Create a Recipes component:

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

And a new RecipeDetail component:

```js
import React from 'react';

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

## Client Side Routing

To begin exploring client side routing we'll use the Reach Router.

Routing is the ability to move between different parts of an application when a user enters a URL or clicks an element (link, button, icon, image etc) within the application.

Up until this point, you have dealt with simple projects that do not require transitioning from one view to another, thus, you are yet to interact with Routing in React.

npm import [reach router](https://reach.tech/router) and import the router into App.

`npm i @reach/router`

```js
import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
// import Recipe from "./Recipe";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import "./index.css";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`/api/recipes`)
      .then(response => response.json())
      .then(json => {
        setRecipes(json);
      });
  }, []);

  return (
    <div>
      <h1>Recipes!</h1>
      <Router>
        <Recipes path="/" recipes={recipes} />
        <RecipeDetail
          path="/recipe/:recipeId"
          recipe={recipes.filter(recipe => recipe._id === recipe.id)}
        />
      </Router>
    </div>
  );
}

export default App;

```

Note: probably the most common router for React is [React Router](https://reacttraining.com/react-router/)

Edit the Recipe component to link to a detail leaving only the description:

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

## fall2019-stop-here

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
