# Express and React

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

  React.useEffect(() => {
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

## Displaying Data

Fetch data from our API using useEffect and use a Recipe component to display them.

`App.js`:

```js
import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

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

Add keys to `Recipe.js`:

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

In preparation for the next steps, create two new components.

A `Recipes` component:

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

And a RecipeDetail component:

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

(`App.js` imports and renders `Recipe.js`. `Recipe.js` imports nothing and renders.)

We'll use these components in the next steps to explore routing.

## Client Side Routing

Up until this point, you have dealt with simple projects that do not require transitioning from one view to another. You have yet to work with Routing in React.

Routing is the ability to move between different parts of an application when a user enters a URL or clicks an element.

To begin exploring client side routing we'll use the [React Router](https://reactrouter.com/web/guides/quick-start).

_Note_: be sure you are cd'ed into the client directory before installing React related packages.

npm import [react router](https://github.com/ReactTraining/react-router#readme) and import the router into App.

```sh
npm i react-router-dom
```

Configure App.js for routing:

```js
import React from "react";
// import Recipe from "./Recipe";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
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

`App.js` imports and renders `Recipes.js` and renders either `Recipes.js` or `RecipesDetail.js` depending on the Route.

`Recipes.js` imports and renders `Recipes.js`.

`RecipesDetail.js` imports nothing and renders.

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

Build out the details in RecipeDetail using filter and useParams:

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

Add a 'Home' link to `RecipeDetail.js`:

```js
import { Link, useParams } from "react-router-dom";
...
<Link to="/">Home</Link>
```

## Fetching

Currently a recipe is extracted from recipes props using filter.

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

That gets rid of the error. Why?

Selectively add the Ingredients to the return:

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

Another error (you may have to navigate to the details page from the list page).

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
        setLoading(false);
      })
      .catch((err) => console.warn(err));
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
        setLoading(false);
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

`RecipeMaintenance.js:`

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
return (
  <div>
    <h1>Recipes!</h1>
    <Router>
      <Switch>
        <Route exact path="/">
          <Recipes recipes={recipes} />
        </Route>
        <Route path="/:recipeId">
          <RecipeDetail />
        </Route>
        <Route path="/maintenance">
          <RecipeMaintenance />
        </Route>
      </Switch>
    </Router>
  </div>
);
```

Test the path in the browser. You'll get a recipe detail default. Why?

`switch` is greedy. It takes the first valid route it finds. That's why we use `exact` on the main route.

in `App.js`:

```js
return (
  <div>
    <h1>Recipes!</h1>
    <Router>
      <Switch>
        <Route exact path="/">
          <Recipes recipes={recipes} />
        </Route>
        <Route path="/recipe/:recipeId">
          <RecipeDetail />
        </Route>
        <Route path="/secret/maintenance">
          <RecipeMaintenance />
        </Route>
      </Switch>
    </Router>
  </div>
);
```

In `Recipe.js`:

```js
return (
  <>
    <img src={`/img/${image}`} alt={name} />
    <h3>
      <Link to={`/recipe/${_id}`}>{title}</Link>
    </h3>
    <p>{description}</p>
  </>
);
```

Back to the maintenance form.

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

[Uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html) use `refs`. Controlled components use `state`.

## Uncontrolled Class Components

[Refs](https://reactjs.org/docs/refs-and-the-dom.html) provide a way to access DOM nodes or React elements created in the render method.

Add refs to the createRecipe function:

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

Refs use [defaultValues](https://reactjs.org/docs/uncontrolled-components.html#default-values) when you want to provide a default:

```js
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      title: this.nameRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value,
    };
    console.log(recipe);
  }

  handleChange(e) {
    console.log("  ", e);
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
            defaultValue="recipe name"
            ref={this.nameRef}
          />
          <input
            type="text"
            name="image"
            placeholder="Recipe image"
            defaultValue="recipe image"
            ref={this.imageRef}
          />
          <textarea
            type="text"
            name="description"
            placeholder="Recipe description"
            defaultValue="recipe description"
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

## RecipeMaintenance Function

Add a call to a function `addRecipe.js` we will create.

`RecipeMaintenance.js`:

```js
import React, { Component } from "react";

class RecipeMaintenance extends Component {
  nameRef = React.createRef();
  imageRef = React.createRef();
  descriptionRef = React.createRef();

  createRecipe(e) {
    e.preventDefault();
    const recipe = {
      title: this.nameRef.current.value,
      image: this.imageRef.current.value,
      description: this.descriptionRef.current.value,
    };
    this.props.addRecipe(recipe);
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
            defaultValue="recipe name"
            ref={this.nameRef}
          />
          <input
            type="text"
            name="image"
            placeholder="Recipe image"
            defaultValue="toast.png"
            ref={this.imageRef}
          />
          <textarea
            type="text"
            name="description"
            placeholder="Recipe description"
            defaultValue="recipe description"
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

Note: there is no need for an `onChange` handler when using refs:

```js
handleChange(e) {
  console.log("  ", e);
}
```

Add the addRecipe function to App.js and props drill it down to `RecipeMaintenance`:

```js
  const addRecipe = (recipe) => {
    console.log(" from App ::: ", recipe);
    setRecipes([
      ...recipes,
      {
        name: recipe.name,
        image: recipe.image,
        description: recipe.description,
      },
    ]);
  };

...

return (
    <div>
      <h1>Recipes!</h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <Recipes recipes={recipes} />
          </Route>
          <Route path="/recipe/:recipeId">
            <RecipeDetail />
          </Route>
          <Route path="/secret/maintenance">
            <RecipeMaintenance addRecipe={addRecipe} />
          </Route>
        </Switch>
      </Router>
    </div>
  );

```

You should see the new recipe in App in the Components dev tool.

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
    )
    .catch((error) => console.log(error));
};
```

Test the form.

## Adding a NavBar

Create `Nav.js`:

```js
import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Recipes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
```

Import it and render in `App.js`:

```js
return (
  <div>
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Recipes recipes={recipes} />
        </Route>
        <Route path="/recipe/:recipeId">
          <RecipeDetail />
        </Route>
        <Route path="/secret/maintenance">
          <RecipeMaintenance addRecipe={addRecipe} />
        </Route>
      </Switch>
    </Router>
  </div>
);
```

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
nav ul {
  list-style: none;
  padding: 0;
}
nav a {
  color: #fff;
  padding: 1rem;
}
```

Add a link to Maintenance:

```js
import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <h1>
        <Link to="/">Recipes</Link>
        <Link to="/secret/maintenance">Maintenance</Link>
      </h1>
    </nav>
  );
};

export default Nav;
```

And style accordingly.

## Custom Hooks

In `index.js` we comment out the import statement and add some test code:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);
  const [post, setPost] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [index]);

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

Create a function `useFetch` in index.js:

```js
// import App from "./components/App";
// NEW
function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}
```

Destructure the elements from the function in App:

```js
// const [post, setPost] = React.useState([]);
// const [loading, setLoading] = React.useState(false);
// const [error, setError] = React.useState("");

const { loading, data: post, error } = useFetch(
  `https://jsonplaceholder.typicode.com/posts/${postIds[index]}`
);
```

And comment out the current useEffect:

```js
const { loading, data: post, error } = useFetch(
  `https://jsonplaceholder.typicode.com/posts/${postIds[index]}`
);

// React.useEffect(() => {
//   setLoading(true);
//   fetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`)
//     .then((res) => res.json())
//     .then((data) => {
//       setPost(data);
//       setError(null);
//       setLoading(false);
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       setError("error loading data");
//       setLoading(false);
//     });
// }, [index]);
```

Test and clean up the file.

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);

  const { loading, data: post, error } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postIds[index]}`
  );

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

Create a hooks directory in src, move the custom hook with the changes below into it, and export it.

```js
import React from "react";

export function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}
```

and import the hook into `index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

import { useFetch } from "./hooks/useFetch";

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);

  const { loading, data: post, error } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postIds[index]}`
  );

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

Reset `index.js` to use our old App file. We will retrofit our hook for use in out recipes app.

<!-- ```js
import React from "react";

export function useFetch(url, method, body = "") {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url, {
      method,
      ...(body ? { body } : {}),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url, body, method]);

  return {
    loading,
    data,
    error,
  };
}
``` -->

- import the hook into App.js:

```js
import { useFetch } from "../hooks/useFetch";
```

Destructure useFetch's return values

```js
function App() {
  const { loading, data, error } = useFetch(`/api/recipes`);
  const [recipes, setRecipes] = React.useState(data);
```

And comment out the recipes route:

```js
<Route exact path="/">
  {/* <Recipes recipes={data} /> */}
</Route>
```

There should be an error on reload.

Add the loading and error returns we used in the json placeholder example:

```js
if (loading === true) {
  return <p>Loading</p>;
}

if (error) {
  return (
    <React.Fragment>
      <p>{error}</p>
    </React.Fragment>
  );
}
```

Here is App.js in its entirety:

```js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./Nav";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import RecipeMaintenance from "./RecipeMaintenance";

import { useFetch } from "../hooks/useFetch";

function App() {
  const { loading, data, error } = useFetch(`/api/recipes`);
  const [recipes, setRecipes] = React.useState(data);

  const addRecipe = (recipe) => {
    fetch(`/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
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
      )
      .catch((error) => console.log(error));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
      </React.Fragment>
    );
  }

  return (
    <div>
      <h1>Recipes!</h1>
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/">
            <Recipes recipes={data} />
          </Route>
          <Route path="/recipe/:recipeId">
            <RecipeDetail />
          </Route>
          <Route path="/secret/maintenance">
            <RecipeMaintenance addRecipe={addRecipe} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
```

## Making It General

We can use our hook in `RecipeDetail.js`.

- reconfigure the useFetch hook:

```js
import React from "react";

export function useFetch(url, method, body = "") {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url, {
      method,
      ...(body ? { body } : {}),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url, body, method]);

  return {
    loading,
    data,
    error,
  };
}
```

Note: we need to pass a method now.

In App.js:

```js
const { loading, data, error } = useFetch(`/api/recipes`, "get");
```

In `RecipeDetail.js`:

- import the hook:

```js
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
```

Comment out the recipe state:

```js
// const [recipe, setRecipe] = React.useState({
//   title: "",
//   description: "",
//   image: "toast.png",
//   ingredients: [],
//   preparation: [],
// });

// const [loading, setLoading] = React.useState(false);
```

And the fetch:

```js
// React.useEffect(() => {
//   setLoading(true);
//   fetch(`/api/recipes/${recipeId}`)
//     .then((response) => response.json())
//     .then((json) => {
//       setRecipe(json);
//       setLoading(false);
//     })
//     .catch((err) => console.log(err));
// }, [recipeId]);
```

Use the hook:

```js
const { recipeId } = useParams();
const { loading, data: recipe, error } = useFetch(`/api/recipes/${recipeId}`);
```

RecipeDetail in its entirety:

```js
import React from "react";
import { useParams, Link } from "react-router-dom";

import { useFetch } from "../hooks/useFetch";

function RecipeDetail() {
  const { recipeId } = useParams();
  const { loading, data: recipe, error } = useFetch(`/api/recipes/${recipeId}`);

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
      </React.Fragment>
    );
  }

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

## Reduce

```js
const nums = [2, 4, 6];
let state = 0;

function sum(value) {
  state += value;
}

nums.forEach(sum);

console.log("state", state);
```

`forEach` adds up all of the values but we need an intermediate value (state).

`forEach` is dependent on the state of our application and its modifying state outside of its own scope - this makes it an "impure" function - avoid this when possible with the `reduce` method.

```js
const nums = [2, 4, 6];

function reducer(state, value) {
  return state + value;
}

const total = nums.reduce(reducer, 0);

console.log("total", total);
```

- The very first time the reducer function is invoked, state will be 0 and value will be 2.
- On the next invocation, state will be whatever the previous invocation returned, which was 0 + 2 and value will be the 2nd element in the array, 4.
- On the next invocation, state will be 6 (2 + 4) and value will be 6.
- Finally, since are no more elements in the collection to iterate over, the returned value will be 6 + 6 or 12.

```
Initial Value: 0

First invocation:
  state: 0
  value: 2

Second invocation:
  state: 2
  value: 4

Third invocation:
  state: 6
  value: 6

No more elements in the collection, return 6 + 6 which is 12.
```

Note: the default initializer for reduce is the first value in the array so it could be written as:

```js
const nums = [2, 4, 6];

function reducer(state, value) {
  return state + value;
}

const total = nums.reduce(reducer);

console.log("total", total);
```

## useReducer

React comes with a built-in Hook called useReducer that allows you to add state to a function component but manage that state using the reducer pattern.

`useState` and `useReducer` both allow you to add state to function components. `useReducer` offers a bit more flexibility since it allows you to decouple how the state is updated from the action that triggered the update - typically leading to more declarative state updates.

`useReducer` returns an array with the first element being the state and the second element being a dispatch function which when called, will invoke the reducer.

```js
const [state, dispatch] = React.useReducer(reducer, initialState);
```

Examine the following code in index.js:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

function reducer(state, value) {
  return state + value;
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => dispatch(1)}>+</button>
    </>
  );
}

ReactDOM.render(<Counter />, document.querySelector("#root"));
```

When + is clicked, dispatch will be invoked. That calls reducer passing it two arguments,

1. state, which will come implicitly from React,
2. value, which will be whatever was passed to dispatch.

What we return from reducer will become the new count.

Finally, because count changed, React will re-render the component, updating the UI.

Subtracting:

```js
function reducer(state, value) {
  return state + value;
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <React.Fragment>
      <h1>{count}</h1>
      <button onClick={() => dispatch(1)}>+</button>
      <button onClick={() => dispatch(-1)}> - </button>{" "}
    </React.Fragment>
  );
}
```

Typically in React, instead of dispatching the value we dispatch the type of action that occurred:

```js
function reducer(state, action) {
  if (action === "increment") {
    return state + 1;
  } else if (action === "decrement") {
    return state - 1;
  } else if (action === "reset") {
    return 0;
  } else {
    throw new Error(`This action type isn't supported.`);
  }
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <React.Fragment>
      <h1>{count}</h1>
      <button onClick={() => dispatch("increment")}>+</button>
      <button onClick={() => dispatch("decrement")}>-</button>
      <button onClick={() => dispatch("reset")}>Reset</button>
    </React.Fragment>
  );
}
```

We’ve decoupled the update logic of count from our component. We’re now mapping actions to state changes and separating how the state updates from the action that occurred.

Instead of incrementing and decrementing count by 1, let’s decide via a slider

Create Slider.js in components:

```js
import React from "react";

export default function Slider({ onChange }) {
  const [value, setValue] = React.useState(1);

  return (
    <>
      {value}
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => {
          const value = Number(e.target.value);
          onChange(value);
          setValue(value);
        }}
      />
    </>
  );
}
```

And change index.js:

```js
import Slider from "./components/Slider";

function reducer(state, action) {
  if (action.type === "increment") {
    return {
      count: state.count + state.step,
      step: state.step,
    };
  } else if (action.type === "decrement") {
    return {
      count: state.count - state.step,
      step: state.step,
    };
  } else if (action.type === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else if (action.type === "updateStep") {
    return {
      count: state.count,
      step: action.step,
    };
  } else {
    throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { count: 0, step: 1 });

  return (
    <>
      <Slider
        onChange={(value) =>
          dispatch({
            type: "updateStep",
            step: value,
          })
        }
      />
      <hr />
      <h1>{state.count}</h1>
      <button
        onClick={() =>
          dispatch({
            type: "increment",
          })
        }
      >
        +
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "decrement",
          })
        }
      >
        -
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "reset",
          })
        }
      >
        Reset
      </button>
    </>
  );
}
```

To use a step we need to use an object for the intial state of our reducer:

```js
const [state, dispatch] = React.useReducer(reducer, { count: 0, step: 1 });
```

And since state is no longer an integer we updated the reducer:

```js
function reducer(state, action) {
  if (action === "increment") {
    return {
      count: state.count + 1,
      step: state.step,
    };
  } else if (action === "decrement") {
    return {
      count: state.count - 1,
      step: state.step,
    };
  } else if (action === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else {
    throw new Error(`This action type isn't supported.`);
  }
}
```

Previously we dispatched the type of action that occurred (increment, decrement, and reset).

We pass along the value of the slider so we can update our step state and we've updated our dispatches to pass an object:

```js
<>
  <Slider
    onChange={(value) =>
      dispatch({
        type: "updateStep",
        step: value,
      })
    }
  />
  <hr />
  <h1>{state.count}</h1>
  <button
    onClick={() =>
      dispatch({
        type: "increment",
      })
    }
  >
    +
  </button>
  <button
    onClick={() =>
      dispatch({
        type: "decrement",
      })
    }
  >
    -
  </button>
  <button
    onClick={() =>
      dispatch({
        type: "reset",
      })
    }
  >
    Reset
  </button>
</>
```

Finally, we account for

- our new action updateStep,
- changing action to be an object instead of a string
- adjust increment and decrement to adjust the count based on the step property and not just 1

```js
function reducer(state, action) {
  if (action.type === "increment") {
    return {
      count: state.count + state.step,
      step: state.step,
    };
  } else if (action.type === "decrement") {
    return {
      count: state.count - state.step,
      step: state.step,
    };
  } else if (action.type === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else if (action.type === "updateStep") {
    return {
      count: state.count,
      step: action.step,
    };
  } else {
    throw new Error();
  }
}
```

Let's try a simple experiment on our recipes home page.

Reset index.js so its displaying the recipes.

- add a reducer after the imports:

```js
const reducer = (state, action) => {
  switch (action) {
    case "on":
      return true;
    case "off":
      return false;
    default:
      return state;
  }
};
```

- add the useReducer hook:

```js
const { loading, data, error } = useFetch(`/api/recipes`, "get");
const [recipes, setRecipes] = React.useState(data);
// NEW
const [light, dispatch] = React.useReducer(reducer, true);
```

- add two buttons after the header:

```js
<header>
  <h1>Recipes!</h1>
  <div>
    <button onClick={() => dispatch("on")}>Light</button>
    <button onClick={() => dispatch("off")}>Dark</button>
  </div>
</header>
```

- finally, add css

```js
header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

div {
  padding: 1rem;
}

div.lit {
  background-color: #fff;
}

.unlit {
  background-color: #555;
}

.unlit {
  color: #fff;
}

.unlit a {
  color: #eee;
}
```

## Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level. - The React Docs

## Instructor Notes

## Storing

`const [theme, setTheme] = useLocalStorage('theme', 'light');`

```js
import * as React from "react";

export const useLocalStorage = (key, defaultVal) => {
  const [state, setState] = React.useState(() => {
    let val;
    try {
      val = JSON.parse(window.localStorage.getItem(key) || String(defaultVal));
    } catch (err) {
      val = defaultVal;
    }
    return val;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
};
```

Convert the maintenance screen to a functional component with state:

```js
import React from "react";

function RecipeMaintenance(props) {
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createRecipe = (e) => {
    e.preventDefault();
    const recipe = {
      title,
      image,
      description,
    };
    // this.props.addRecipe(recipe);
    console.log(recipe);
  };

  return (
    <div>
      <h3>Add Recipe Form</h3>
      <form onSubmit={(e) => createRecipe(e)}>
        <input
          type="text"
          name="title"
          placeholder="Recipe title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="text"
          name="image"
          placeholder="Recipe image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
        <textarea
          type="text"
          name="description"
          placeholder="Recipe description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default RecipeMaintenance;
```

<!-- HERE -->

https://dev.to/ksushiva/authentication-with-react-js-9e4

https://dev.to/techcheck/react-hooks-usereducer-pnj

https://dev.to/mbellagamba/data-fetching-react-hook-4dfc

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
`            value={this.state.recipe.description}
          />
          <button>Update</button>
        </form>
      </div>
    );
  }
}

export default EditRecipe;
```
