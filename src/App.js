import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/home'
import './App.scss'

function App() {
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path='/'
              render={() => <Home />}
            />
          </Switch>
        </div>
      </Router>

    </div>
  );
}

export default App;
