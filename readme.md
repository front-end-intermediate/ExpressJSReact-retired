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

## Homework

You should continue to build out the details component. 

This project is a template for your final project which **must** include an Express API as well as a font end wirtten in React. 

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