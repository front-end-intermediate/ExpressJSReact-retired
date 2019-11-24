# Express and React

v 4.0

- [Express and React](#express-and-react)
  - [Homework](#homework)
  - [Reading](#reading)
  - [Exercise: React Front End](#exercise-react-front-end)
  - [Own the Repo](#own-the-repo)
  - [Create a React Project](#create-a-react-project)
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
  - [Recipe Detail](#recipe-detail)
  - [Adding a Recipe](#adding-a-recipe)
- [fall2019-start-here](#fall2019-start-here)
  - [Recipe Maintenance Function](#recipe-maintenance-function)
  - [Adding a NavBar](#adding-a-navbar)
  - [CSS in JS and React Icons](#css-in-js-and-react-icons)
  - [Deployment](#deployment)
  - [Notes](#notes)
  - [Editing a Recipe](#editing-a-recipe)

## Homework

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

## Own the Repo

Create a new repo on your Github account.

Check the current origin, remove the origin and add a new one:

```sh
git remote -v
git remote rm origin
git remote add origin <your-new-github-repo>
git push -u origin master
```

Demo: npm install and run dev.

Reconstitute the `.env` file:

```js
NODE_ENV=development
DATABASE=mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority
PORT=3000
```

Go to [MongoDb](https://www.mongodb.com) and sign in to your account. Find the Cluster you created for this project and click on 'Connect' to get the connection string.

Replace the database variable in `.env` with your own. Also, review the Database Access and Network Access settings on MongoDb. Check to ensure that your IP address settings are current or set to 'all.'

npm install and run `npm run dev` to test. You should see the vanilla js site we contructed at port 3000. Be sure to test the `/api/recipes` endpoint as well.

Note: you might want to install a JSON formatter for you browser.

[Chrome](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) or use [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/).

## Create a React Project

Kill the server if running.

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
import React from 'react';
import ReactDOM from 'react-dom';

function HelloWorld() {
  return <div>Hello world</div>;
}

ReactDOM.render(<HelloWorld />, document.querySelector('#root'));
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

Note the `--prefix` option for the React client. This redirects the start command to our client folder.

Note: you'll need to set the old `dev` script to 'server'. Here's the entire scripts portion of package.json.

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

`"proxy": "http://localhost:5000",`

cd into the root and run `npm run dev`.

_Important_: any React specific npm installs need to be done in the client folder.

Test to make sure you can access both the React front end and the ExpressJS back end at their respective ports.

## The First Component

In a new components directory.

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

To test the new component make adjustments to index.js (import and render App) and App.js (export it as default and provide an empty index.css) as needed.

## Aside: CORS

I doubt we will need [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in this exercise but in the event you need them in an application in the future you would add the following to `server.js`:

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
import './index.css';

class App extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    fetch(`/api/recipes`)
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

export default App;
```

Since we set a proxy for the front end we can use:

```js
fetch(`/api/recipes`);
```

Instead of:

```js
fetch(`http://localhost:5000/api/recipes`);
```

## Multiple Components

Breakout the Recipe component into a separate file:

```js
import React from 'react';

class Recipe extends React.Component {
  render() {
    return <p>{this.props.recipe.title}</p>;
  }
}

export default Recipe;
```

The App component imports and renders the Recipe component.

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
import React from 'react';

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

Go to `https://codesandbox.io` and use `File > New Sandbox` to create a new React sandbox.

For this short exercise we will use the Github API.

`https://developer.github.com/v3/repos/#list-organization-repositories`

View your info on Github using your own username) e.g.:

`https://api.github.com/users/DannyBoyNYC`

Examine the info. To view your repos e.g.:

`https://api.github.com/users/DannyBoyNYC/repos`

We'll use Facebook's repos:

`https://api.github.com/orgs/facebook/repos`

```js
import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

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

const rootElement = document.getElementById('root');
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

Note the React dev tools button at the bottom of the page.

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

  componentDidMount() {
    this.setState({ loading: true });
    fetch('https://api.github.com/orgs/facebook/repos')
      .then(res => res.json())
      .then(json => this.setState({ repos: json, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.loading) {
      return <div>Loading repos...</div>;
    }
    return (
      <div>
        <h1>Repos</h1>
        <ul>
          {this.state.repos.map(repo => (
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
function GithubHooks() {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);

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
```

Render the functional component to the DOM:

`ReactDOM.render(<GithubHooks />, rootElement);`

### useEffect

Fetching the data.

Import [useEffect](https://reactjs.org/docs/hooks-effect.html) hook:

`import React, {useState, useEffect} from "react";`

Set the data with useEffect:

```js
useEffect(() => {
  setLoading(true);
  fetch('https://api.github.com/orgs/facebook/repos')
    .then(res => res.json())
    .then(json => {
      setLoading(false);
      setRepos(json);
    })
    .catch(setLoading(false));
}, []);
```

Final component

```js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

function GithubHooks() {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.github.com/orgs/facebook/repos')
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

const rootElement = document.getElementById('root');
ReactDOM.render(<GithubHooks />, rootElement);
```

## Exercise Continued

Convert the App component to a function:

```js
import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`/api/recipes`)
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

In preparation for the next steps, create a new Recipes component:

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

Up until this point, you have dealt with simple projects that do not require transitioning from one view to another. You have yet to work with Routing in React.

npm import [reach router](https://reach.tech/router) and import the router into App.

_Note_: be sure you are cd'ed into the client directory before installing React related packages.

`npm i @reach/router`

Configure App.js for routing:

```js
import React, { useState, useEffect } from 'react';
import { Router } from '@reach/router';
// import Recipe from "./Recipe";
import Recipes from './Recipes';
import RecipeDetail from './RecipeDetail';
import './index.css';

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
        <Recipes path='/' recipes={recipes} />
        <RecipeDetail
          path='/recipe/:recipeId'
          recipe={recipes.filter(recipe => recipe._id === recipe.id)}
        />
      </Router>
    </div>
  );
}

export default App;
```

Test by using a recipe `_id` at the route.

Note: probably the most common router for React is [React Router](https://reacttraining.com/react-router/)

Note: at the end of last class we had just implemented Routing.

If you are having difficulty running `npm run dev` you may wish to increment the ports being used in:

- .env
- server.js
- client/package.json (the proxy)

If you are installing npm package be sure to install once in the top level of the project _and_ in the client folder.

===

Edit the Recipe component to link to a detail leaving only the description:

```js
import React from 'react';
import { Link } from '@reach/router';

function Recipe(props) {
  const { _id, title, description, image } = props.recipe;

  return (
    <>
      <img
        src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${image}`}
        alt={props.recipe.name}
      />
      <h3>
        <Link to={`/recipe/${_id}`}>{title}</Link>
      </h3>
      <p>{description}</p>
    </>
  );
}

export default Recipe;
```

Note the `Link` import from Reach router..

## Recipe Detail

```js
import React from 'react';

function RecipeDetail(props) {
  const { recipeId } = props;
  return (
    <div>
      <h1>{recipeId}</h1>
    </div>
  );
}

export default RecipeDetail;
```

We need to pass recipes as a props to RecipeDetail. Add them to the route in App:

```js
<RecipeDetail path='/recipe/:recipeId' recipes={recipes} />
```

Now that we have a recipes prop available in RecipeDetail we can build out the details themselves:

```js
import React, { useState, useEffect } from 'react';

function RecipeDetail(props) {
  const recipeId = props.recipeId;
  const currRecipe = props.recipes.filter(recipe => recipe._id === recipeId);
  console.log(currRecipe[0]);

  return (
    <>
      {currRecipe.map(item => (
        <div key={item._id}>
          <img
            src={`http://oit2.scps.nyu.edu/~devereld/intermediate/img/${item.image}`}
            alt={item.title}
          />
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <h3>Ingredients</h3>
          <ul>
            {item.ingredients.map(ingredient => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h3>Preparation</h3>
          <ul>
            {item.preparation.map(prep => (
              <li key={prep.step}>{prep.step}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default RecipeDetail;
```

Add a 'Home' link to the RecipeDetails:

```js
import { Link } from "@reach/router";
...
<Link to="/">Home</Link>
```

## Adding a Recipe

We'll mimic a administration panel (which would normally be password protected etc.) with a maintenance component. Security through obscurity!

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

Note: this is a class component - for the time being.

Import the component into App.js:

`import RecipeMaintenance from './RecipeMaintenance';`

And add it to the routing scheme.

```js
<Router>
  <Recipes path='/' recipes={recipes} />
  <RecipeDetail path='/recipe/:recipeId' />
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
    // this.props.addRecipe(recipe);
    console.log(recipe);
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

# fall2019-start-here

## Recipe Maintenance Function

Convert the RecipeMaintenance component to a function:

```js
import React, { useRef } from 'react';

function RecipeMaintenance(props) {
  const nameRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();

  const createRecipe = e => {
    e.preventDefault();
    const recipe = {
      name: nameRef.current.value,
      image: imageRef.current.value,
      description: descriptionRef.current.value
    };
    props.addRecipe(recipe);
  };

  return (
    <div>
      <h3>Add Recipe Form</h3>
      <form onSubmit={e => createRecipe(e)}>
        <input
          type='text'
          name='name'
          placeholder='Recipe name'
          ref={nameRef}
        />
        <input
          type='text'
          name='image'
          placeholder='Recipe image'
          ref={imageRef}
        />
        <textarea
          type='text'
          name='description'
          placeholder='Recipe description'
          ref={descriptionRef}
        />
        <button type='submit'>Add Recipe</button>
      </form>
    </div>
  );
}

export default RecipeMaintenance;
```

Review the last course section - [Hooks](https://github.com/front-end-intermediate/Hooks)

Add the addRecipe function to App.js and send it as a prop to RecipeMaintenance:

```js
const addRecipe = ({ name, image, description }) => {
  setRecipes([
    ...recipes,
    {
      name: name,
      image: image,
      description: description
    }
  ]);
};

...

<RecipeMaintenance path='/maintenance' addRecipe={addRecipe} />;

```

<!-- function component => =>  Collect the state using a spread operator and log that to the console:

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
``` -->

Expand the function to use our api. Note the fetch options:

```js
const addRecipe = recipe => {
  fetch(`/api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
    .then(res => {
      if (res.ok) {
        return res;
      }
      throw new Error('Could not create a recipe');
    })
    .then(res => res.json())
    .then(recipe =>
      setRecipes([
        ...recipes,
        {
          name: recipe.name,
          image: recipe.image,
          description: recipe.description
        }
      ])
    );
};
```

recipe.controllers:

```js
exports.add = function(req, res) {
  Recipe.create(req.body, function(err, json) {
    if (err) return res.send(err);
    return res.send(json);
  });
};
```

<!-- ```js
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
``` -->

Test the form.

Ooops, wrong name. Swap name for title:

RecipeMaintenance:

```js
const createRecipe = e => {
  e.preventDefault();
  const recipe = {
    title: nameRef.current.value,
    image: imageRef.current.value,
    description: descriptionRef.current.value
  };
  props.addRecipe(recipe);
};
```

<!-- ```js
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
``` -->

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
function ListRecipes(props) {
  return (
    <ul>
      {props.recipes.map(recipe => (
        <li key={recipe._id}>
          {recipe.title}
          <button onClick={() => props.deleteRecipe(recipe._id)}>X</button>
        </li>
      ))}
    </ul>
  );
}
```

And:

`<ListRecipes recipes={props.recipes} deleteRecipe={props.deleteRecipe} />`

Be sure to pass the recipes to the component from App.js:

```js
<Router>
  <Recipes path='/' recipes={recipes} />
  <RecipeDetail path='/recipe/:recipeId' recipes={recipes} />
  <RecipeMaintenance
    path='/maintenance'
    addRecipe={addRecipe}
    recipes={recipes}
  />
</Router>
```

Create the deleteRecipe function in App:

```js
const deleteRecipe = recipeToDelete => {
  fetch(`/api/recipes/${recipeToDelete._id}`, {
    method: 'DELETE'
  }).then(res => {
    setRecipes(recipes =>
      recipes.filter(recipe => recipe._id !== recipeToDelete._id)
    );
  });
};
```

and

```js
<ListRecipes recipes={props.recipes} deleteRecipe={props.deleteRecipe} />
```

Test deleting a recipe.

## CSS in JS and React Icons

`cd` into the client folder.

`npm install react-icons` and `npm install emotion`

use them in the maintenance interface:

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

## Deployment

We could run `npm run build` in the client folder and use that or use a Heroku postbuild script.

In the script section of server's package.json add a script to:

1. turn production mode off (you can't run npm build in the production environment)
2. do an npm install and build (prefixing client)

```js
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
```

`server.js` needs to be set up to serve the build.

Make sure the following goes after _all_ the routes:

```js
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

The path.resolve has to have four arguments.

Because we're using Node's built in path method be sure to require it (at the top of server.js):

`const path = require('path');`

And also... be sure to remove the old express.static middleware (it is now in the 'else' statement above).

You can also add your database URI to `Config Vars` in the Heroku `Settings` for your project.

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
