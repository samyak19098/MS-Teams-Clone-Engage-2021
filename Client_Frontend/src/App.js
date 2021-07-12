// import './App.css';
import Header from './Components/Header';
import CallRoom from './Components/CallRoom';
import Home from './Components/Home';
import StartCall from './Components/StartCall';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">
          <>
            <Router>
                <Switch>
                  <Route exact path="/" component = {Home}/>
                  <Route  path="/callroom/:call_room_id" component={CallRoom}/>
                </Switch>
            </Router>
          </>
    </div>
  );
}

export default App;
