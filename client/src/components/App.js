import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Recipes from './Recipes'
import RecipeDetail from './RecipeDetail'
import Nav from './Nav'
import { useApi } from '../hooks/useFetch'

function App() {
    const { get, post } = useApi()
    const [recipes, setRecipes] = React.useState([])
    const [recipe, setRecipe] = React.useState()
    const [loggedin, setLoggedin] = React.useState(true)

    React.useEffect(() => {
        get('/api/recipes').then((data) => {
            setRecipes(data)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe])

    const addRecipe = (recipe) => {
        console.log('bar:', recipe)
        post('/api/recipes', recipe).then((data) => {
            setRecipe(data)
        })
    }

    return (
        <div>
            <Router>
                <Nav setLoggedin={setLoggedin} loggedin={loggedin} />
                <Switch>
                    <Route exact path="/">
                        <Recipes
                            recipes={recipes}
                            loggedin={loggedin}
                            addRecipe={addRecipe}
                        />
                    </Route>
                    <Route path="/:recipeId">
                        <RecipeDetail />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
