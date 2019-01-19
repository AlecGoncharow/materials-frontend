import React, { Component } from 'react';
import './App.css';
import CoverageGraph from './CoverageGraph'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    fetch("https://car-cs.herokuapp.com/data/")
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((resp_data) => {
          console.log(resp_data);
          this.setState({data: resp_data});
        })
        .then(() => console.log(this.state))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <h1>Hello World!</h1>
        </header>
          <div>
              <CoverageGraph data={[5,10,1,3,4,5,6,7,8,9]} size={[500,500]} assignments={this.state.data} />
          </div>
      </div>
    );
  }
}

export default App;
