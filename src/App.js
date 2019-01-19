import React, { Component } from 'react';
import './App.css';
//import CoverageGraph from './CoverageGraph'
import ButtonAppBar from './HeaderBar';
import CircularIndeterminate from './Loading';
import BasicSunburst from './basic-sunburst';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: false,
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
      if (!this.state.data) {
          return (
              <div className="App">
                  <ButtonAppBar/>
                  <CircularIndeterminate/>
              </div>
          )
      }
      else {
          let sunStyle = {
              display: 'flex',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
          };
          return (
              <div className="App">
                  <ButtonAppBar/>
                  <div style={sunStyle}>
                      <BasicSunburst />
                  </div>
              </div>
          );
      }
  }
}


export default App;
