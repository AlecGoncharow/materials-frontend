import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import App from "./App";
import Similarity from "./Similarity";
import Coverage from "./Coverage";

class MyRouter extends Component {
  render() {
      return (
          <Router>
              <Switch>
                  <Route path="/similarity/:set" component={Similarity}/>
                  <Route path="/similarity" component={Similarity}/>
                  <Route path="/coverage" component={Coverage}/>
                  <Route path="/" component={App}/>
              </Switch>
          </Router>
      );
  }
}

export default MyRouter;