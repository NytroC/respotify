import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import LoggedIn from "./LoggedIn";
import Artist from "./Artist"
const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/loggedin" component={LoggedIn} />
        <Route exact path="/artist" component={Artist} />
      </div>
    </Router>
  );
};

export default App;