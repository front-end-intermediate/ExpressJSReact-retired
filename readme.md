# Express and React

- [Express and React](#express-and-react)
- [Create React App](#create-react-app)
  - [First Component](#first-component)
  - [Using CORS](#using-cors)
  - [Recipes](#recipes)

# Create React App

Create a React project:

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

## First Component

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

## Using CORS

CORS. In `server.js`:

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

Create a components folder in src and break the App and Recipe components into separate files.

## Recipes

Scaffold the Recipes component.

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
      </>
    );
  }
}

export default Recipe;
```
