# Express and React

v 5.0

<!-- ## Homework

Note: your final project **must** include an Express API as well as a front end written in React. You can use the [Heroku Deploy](https://github.com/front-end-intermediate/heroku-deploy) repo as a starter for your api and the material below for the front end. -->

## Reading

Read and step through the [useState](https://reactjs.org/docs/hooks-state.html) and [useEffect](https://reactjs.org/docs/hooks-effect.html) documentation. You may wish to use Code Sandbox to examine the code samples.

## Exercise: React Front End

Clone this repo from Github.

```sh
cd <to your class projects directory>
git clone <this-repo>
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

Reconstitute the `.env` file:

```js
NODE_ENV=development
DATABASE=<your-connection-string>
PORT=3000
```

`DATABASE=mongodb+srv://daniel:dd2345@cluster0.3k4ea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

Go to [MongoDb](https://www.mongodb.com) and sign in to your account. Find the Cluster you created for this project and click on 'Connect' to get the connection string.

Replace the database variable in `.env` with your own. Also, review the Database Access and Network Access settings on MongoDb. Check to ensure that your IP address settings are current or set to 'all.'

npm install and run `npm run dev` to test. You should see the vanilla js site we contructed at port 3000. Be sure to test the `/api/recipes` endpoint as well.

Note: you might want to install a JSON formatter for you browser.

[Chrome](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) or use [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/).

## React Review: Code Sandbox

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
import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Github extends React.Component {
  state = {
    repos: [],
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
    repos: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    fetch("https://api.github.com/orgs/facebook/repos")
      .then((res) => res.json())
      .then((json) => this.setState({ repos: json, loading: false }))
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
          {this.state.repos.map((repo) => (
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
        {repos.map((repo) => (
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
  fetch("https://api.github.com/orgs/facebook/repos")
    .then((res) => res.json())
    .then((json) => {
      setLoading(false);
      setRepos(json);
    })
    .catch(setLoading(false));
}, []);
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
      .then((res) => res.json())
      .then((json) => {
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
        {repos.map((repo) => (
          <li key={repo.id}>{repo.full_name}</li>
        ))}
      </ul>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<GithubHooks />, rootElement);
```

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

Note: you'll need to set the old `dev` script to 'server'. Here's the entire scripts portion of package.json.

Edit the package.json scripts:

```js
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js",
  "client": "npm start --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\" --kill-others "
},
```

Note the `--prefix` option for the React client. This redirects the start command to our client folder.

Note: we are now maintaining two package.json files.

Since the Create React App front end and the server _both_ run on port 3000 we'll change the PORT in `.env` and in server.js to 5000.

In `.env`:

```js
NODE_ENV=development
DATABASE=mongodb+srv://daniel:dd2345@cluster0.3k4ea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
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

Create `src/components/App.js`:

```js
import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useState(() => {
    fetch(`http://localhost:5000/api/recipes`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <div>
      <p>Hello from App</p>
    </div>
  );
}
```

To test the new component make adjustments to index.js (import and render App) and App.js (export it as default) and add css from the static folder to a new index.css file and import it:

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

ReactDOM.render(<App />, document.querySelector("#root"));
```

## CORS

We will need to deal with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Add the following to `server.js`:

```js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});
```

<!-- ```js
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "*"
    // "Access-Control-Allow-Headers",
    // "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
``` -->

## Component Lifecycle

Fetch data from our API using useState and use a Recipe component to display them.

App.js:

```js
import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useState(() => {
    fetch(`http://localhost:5000/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  });

  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

function Recipe(props) {
  return <p>{props.recipe.title}</p>;
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
import React from "react";

function Recipe(props) {
  return <p>{props.recipe.title}</p>;
}

export default Recipe;
```

The App component imports and renders the Recipe component.

Scaffold the Recipe component.

```js
import React from "react";

function Recipe(props) {
  const {
    title,
    name,
    description,
    image,
    ingredients,
    preparation,
  } = props.recipe;
  return (
    <>
      <img src={`img/${image}`} alt={name} />
      <h3>{title}</h3>
      <p>{description}</p>
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map((ingredient) => (
          <li>{ingredient}</li>
        ))}
      </ul>
      <h4>Preparation</h4>
      <ul>
        {preparation.map((prep) => (
          <li>{prep.step}</li>
        ))}
      </ul>
    </>
  );
}

export default Recipe;
```

Add keys to Recipe.js:

```js
import React from "react";

function Recipe(props) {
  const {
    title,
    name,
    description,
    image,
    ingredients,
    preparation,
  } = props.recipe;
  return (
    <>
      <img src={`img/${image}`} alt={name} />
      <h3>{title}</h3>
      <p>{description}</p>
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h4>Preparation</h4>
      <ul>
        {preparation.map((prep) => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul>
    </>
  );
}

export default Recipe;
```

<!-- Convert the App component to a function:

```js
import React, { useState, useEffect } from "react";
import Recipe from "./Recipe";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((json) => {
        setRecipes(json);
      });
  });

  return (
    <div>
      {/* <pre>{JSON.stringify(this.state.recipes, null, 2)}</pre> */}
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default App;
``` -->

In preparation for the next steps, create a new Recipes component:

```js
import React from "react";
import Recipe from "./Recipe";

function Recipes({ recipes }) {
  console.log(recipes);
  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default Recipes;
```

And a new RecipeDetail component:

```js
import React from "react";

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

We'll use this component in the next step to explore routing.

## Client Side Routing

Routing is the ability to move between different parts of an application when a user enters a URL or clicks an element (link, button, icon, image etc) within the application.

Up until this point, you have dealt with simple projects that do not require transitioning from one view to another. You have yet to work with Routing in React.

To begin exploring client side routing we'll use the Reach Router.

npm import [react router](https://github.com/ReactTraining/react-router#readme) and import the router into App.

_Note_: be sure you are cd'ed into the client directory before installing React related packages.

`npm i react-router-dom`

Configure App.js for routing:

```js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Recipe from "./Recipe";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((json) => {
        setRecipes(json);
      });
  }, []);

  return (
    <div>
      <h1>Recipes!</h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <Recipes recipes={recipes} />
          </Route>
          <Route path="/:recipeId">
            <RecipeDetail recipes={recipes} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
```

Edit the Recipe component to link to a detail leaving only the description:

```js
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
```

Note the `Link` import from React router..

## Recipe Detail

```js
import React from "react";
import { useParams } from "react-router-dom";

function RecipeDetail(props) {
  const { recipeId } = useParams();
  console.log(recipeId);
  return (
    <div>
      <h1>{recipeId}</h1>
    </div>
  );
}

export default RecipeDetail;
```

Now that we have a recipes prop available in RecipeDetail we can build out the details themselves:

```js
import React from "react";
import { useParams } from "react-router-dom";

function RecipeDetail(props) {
  const { recipeId } = useParams();
  const currRecipe = props.recipes.filter((recipe) => recipe._id === recipeId);
  console.log(currRecipe[0]);

  return (
    <>
      {currRecipe.map((item) => (
        <div key={item._id}>
          <img src={`/img/${item.image}`} alt={item.title} />
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <h3>Ingredients</h3>
          <ul>
            {item.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h3>Preparation</h3>
          <ul>
            {item.preparation.map((prep) => (
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

## Fetching

Currently a recipe is extracted from props using filter. If we refresh the page there is no recipes props to filter and we get an error.

Let's fetch the recipe based on the recipe id instead.

```js
import React from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail(props) {
  const [recipe, setRecipe] = React.useState({});
  const { recipeId } = useParams();

  React.useEffect(() => {
    fetch(`/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((json) => {
        setRecipe(json);
      });
  }, [recipeId]);

  return (
    <div key={recipe._id}>
      <img src={`/img/${recipe.image}`} alt={recipe.title} />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      {/* <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h3>Preparation</h3>
      <ul>
        {recipe.preparation.map((prep) => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul> */}
      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
```

We can now remove the recipes prop being passed into this component from App.

Note the we get a 404 error but that the page does appear. Why?

Add a loading mechanism:

```js
import React from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const [recipe, setRecipe] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { recipeId } = useParams();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((json) => {
        setRecipe(json);
      })
      .then(setLoading(false))
      .catch((err) => console.log(err));
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div key={recipe._id}>
      <img src={`/img/${recipe.image}`} alt={recipe.title} />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      {/* <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h3>Preparation</h3>
      <ul>
        {recipe.preparation.map((prep) => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul> */}
      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
```

We still get a 404 for the image.

Try:

```js
<img
  src={`/img/${recipe.image ? recipe.image : "toast.png"}`}
  alt={recipe.title}
/>
```

Selectively add the Ingredients to the render.

```js
return (
  <div key={recipe._id}>
    <img
      src={`/img/${recipe.image ? recipe.image : "toast.png"}`}
      alt={recipe.title}
    />
    <h1>{recipe.title}</h1>
    <p>{recipe.description}</p>
    <h3>Ingredients</h3>
    <ul>
      {recipe.ingredients.map((ingredient) => (
        <li key={ingredient}>{ingredient}</li>
      ))}
    </ul>
    {/*<h3>Preparation</h3>
    <ul>
      {recipe.preparation.map((prep) => (
        <li key={prep.step}>{prep.step}</li>
      ))}
    </ul> */}
    <Link to="/">Home</Link>
  </div>
);
```

Another error.

We could continue with the checking:

```js
import React from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail(props) {
  const [recipe, setRecipe] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { recipeId } = useParams();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((json) => {
        setRecipe(json);
      })
      .then(setLoading(false))
      .catch((err) => console.log(err));
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div key={recipe._id}>
      <img
        src={`/img/${recipe.image ? recipe.image : "toast.png"}`}
        alt={recipe.title}
      />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      {recipe.ingredients ? (
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        ""
      )}
      <h3>Preparation</h3>
      {recipe.preparation ? (
        <ul>
          {recipe.preparation.map((prep) => (
            <li key={prep.step}>{prep.step}</li>
          ))}
        </ul>
      ) : (
        ""
      )}
      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
```

But this leaves us with ugly brittle code.

Instead we could use the equivalent of "default state" for each of the items by setting the initial state of recipe more fully:

```js
import React from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const [recipe, setRecipe] = React.useState({
    title: "",
    description: "",
    image: "toast.png",
    ingredients: [],
    preparation: [],
  });
  const [loading, setLoading] = React.useState(false);
  const { recipeId } = useParams();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((json) => {
        setRecipe(json);
      })
      .then(setLoading(false))
      .catch((err) => console.log(err));
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div key={recipe._id}>
      <img src={`/img/${recipe.image}`} alt={recipe.title} />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h3>Preparation</h3>
      <ul>
        {recipe.preparation.map((prep) => (
          <li key={prep.step}>{prep.step}</li>
        ))}
      </ul>
      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
```

## Adding a Recipe

We'll mimic a administration panel (which would normally be password protected etc.) with a maintenance component. Security through obscurity!

RecipeMaintenance.js:

```js
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form>
          <input type="text" placeholder="Recipe name" />
          <input type="text" placeholder="Recipe image" />
          <textarea type="text" placeholder="Recipe description" />
          <button type="submit">Add Recipe</button>
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
  <Recipes path="/" recipes={recipes} />
  <RecipeDetail path="/recipe/:recipeId" />
  <RecipeMaintenance path="/maintenance" />
</Router>
```

Test the path in the browser.

Add onSubmit and createRecipe:

```js
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  createRecipe(e) {
    e.preventDefault();
    console.log("making a recipe");
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={(e) => this.createRecipe(e)}>
          <input type="text" placeholder="Recipe name" />
          <input type="text" placeholder="Recipe image" />
          <textarea type="text" placeholder="Recipe description" />
          <button type="submit">Add Recipe</button>
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
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    console.log("making a recipe");
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={(e) => this.createRecipe(e)}>
          <input
            type="text"
            name="name"
            placeholder="Recipe name"
            ref={this.nameRef}
          />
          <input
            type="text"
            name="image"
            placeholder="Recipe image"
            ref={this.imageRef}
          />
          <textarea
            type="text"
            name="description"
            placeholder="Recipe description"
            ref={this.descriptionRef}
          />
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

Complete the createRecipe function:

```js
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      name: this.nameRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value,
    };
    // this.props.addRecipe(recipe);
    console.log(recipe);
  }

  render() {
    return (
      <div>
        <h3>Add Recipe Form</h3>
        <form onSubmit={(e) => this.createRecipe(e)}>
          <input
            type="text"
            name="name"
            placeholder="Recipe name"
            ref={this.nameRef}
          />
          <input
            type="text"
            name="image"
            placeholder="Recipe image"
            ref={this.imageRef}
          />
          <textarea
            type="text"
            name="description"
            placeholder="Recipe description"
            ref={this.descriptionRef}
          />
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    );
  }
}

export default RecipeMaintenance;
```

# fall2019-start-here

## RecipeMaintenance Function

Convert the RecipeMaintenance component to a function:

```js
import React, { useRef } from "react";

function RecipeMaintenance(props) {
  const nameRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();

  const createRecipe = (e) => {
    e.preventDefault();
    const recipe = {
      name: nameRef.current.value,
      image: imageRef.current.value,
      description: descriptionRef.current.value,
    };
    props.addRecipe(recipe);
  };

  return (
    <div>
      <h3>Add Recipe Form</h3>
      <form onSubmit={(e) => createRecipe(e)}>
        <input
          type="text"
          name="name"
          placeholder="Recipe name"
          ref={nameRef}
        />
        <input
          type="text"
          name="image"
          placeholder="Recipe image"
          ref={imageRef}
        />
        <textarea
          type="text"
          name="description"
          placeholder="Recipe description"
          ref={descriptionRef}
        />
        <button type="submit">Add Recipe</button>
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

Expand the function to use our api. Note the fetch options:

```js
const addRecipe = (recipe) => {
  fetch(`/api/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  })
    .then((res) => {
      if (res.ok) {
        return res;
      }
      throw new Error("Could not create a recipe");
    })
    .then((res) => res.json())
    .then((recipe) =>
      setRecipes([
        ...recipes,
        {
          name: recipe.name,
          image: recipe.image,
          description: recipe.description,
        },
      ])
    );
};
```

recipe.controllers:

```js
exports.add = function (req, res) {
  Recipe.create(req.body, function (err, json) {
    if (err) return res.send(err);
    return res.send(json);
  });
};
```

Test the form.

Ooops, wrong name. Swap name for title:

RecipeMaintenance:

```js
const createRecipe = (e) => {
  e.preventDefault();
  const recipe = {
    title: nameRef.current.value,
    image: imageRef.current.value,
    description: descriptionRef.current.value,
  };
  props.addRecipe(recipe);
};
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

Import Link from reach router.

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
  <Link to="/">Home</Link> <Link to="/maintenance">Maintenance</Link>
</nav>
```

Adding delete to RecipeMaintenance:

```js
function ListRecipes(props) {
  return (
    <ul>
      {props.recipes.map((recipe) => (
        <li key={recipe._id}>
          {recipe.title}
          <button onClick={() => props.deleteRecipe(recipe)}>X</button>
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
  <Recipes path="/" recipes={recipes} />
  <RecipeDetail path="/recipe/:recipeId" recipes={recipes} />
  <RecipeMaintenance
    path="/maintenance"
    addRecipe={addRecipe}
    recipes={recipes}
  />
</Router>
```

Create the deleteRecipe function in App:

```js
const deleteRecipe = (recipeToDelete) => {
  fetch(`/api/recipes/${recipeToDelete._id}`, {
    method: "DELETE",
  }).then((res) => {
    setRecipes((recipes) =>
      recipes.filter((recipe) => recipe._id !== recipeToDelete._id)
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

`npm install react-icons emotion`

use them in the maintenance interface:

```js
import { FaTimesCircle } from "react-icons/fa";

function ListRecipes(props) {
  return (
    <ul>
      {props.recipes.map((recipe) => (
        <li key={recipe._id}>
          {recipe.title}
          <button
            onClick={() => props.deleteRecipe(recipe)}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <FaTimesCircle color="rgb(194, 57, 42)" size={20} />
          </button>
        </li>
      ))}
    </ul>
  );
}
```

Note the use of inline css.

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
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
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
import React from "react";

class EditRecipe extends React.Component {
  state = {
    recipe: [],
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeid}`)
      .then((response) => response.json())
      .then((recipe) =>
        this.setState({
          recipe: recipe,
          isLoading: false,
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
        {this.props.recipes.map((recipe) => (
          <li key={recipe._id}>
            <Link to={`/editrecipe/${recipe._id}`}>{recipe.title}</Link>{" "}
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => this.props.handleDelete(recipe._id)}
            >
              <FaTimesCircle color="rgb(194, 57, 42)" size={20} />
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
import React from "react";

class EditRecipe extends React.Component {
  state = {
    recipe: [],
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`http://localhost:5000/api/recipes/${this.props.recipeId}`)
      .then((response) => response.json())
      .then((recipe) =>
        this.setState({
          recipe: recipe,
          isLoading: false,
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
            type="text"
            placeholder="Recipe Title"
            name="title"
            value={this.state.recipe.title}
          />
          <input
            type="text"
            placeholder="Image"
            name="image"
            value={this.state.recipe.image}
          />
          <textarea
            type="text"
            placeholder="Description"
            name="description"
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
