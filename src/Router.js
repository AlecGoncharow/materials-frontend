import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";

class MyRouter extends Component {
  render() {
      return (
          <Router>
              <Switch>
                  <Route path="/assignments" render={() => {
                      window.location = "https://car-cs.herokuapp.com/assignments";
                      return null;
                    }
                  }/>
                  <Route path="/" component={App}/>
              </Switch>
          </Router>
      );
  }
}

export default MyRouter;