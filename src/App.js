import React, { Component } from 'react';
import './App.css';
//import CoverageGraph from './CoverageGraph'
import ButtonAppBar from './HeaderBar';
import CircularIndeterminate from './Loading';
import BasicSunburst from './basic-sunburst';
import LinearIndeterminate from './LinearIndeterminate'
import buildData from './utils';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
        selections: false,
        dataIsBuilt: false,
        acm: false,
        pdc: false,
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
          this.setState({selections: resp_data, dataIsBuilt: false});
        })
        .then(() => {
                fetch("https://car-cs.herokuapp.com/static/assignments/js/pdc.json")
                    .then((response) => {
                        console.log(response);
                        return response.json();
                    })
                    .then((resp_data) => {
                        console.log(resp_data);
                        let data = buildData({cls: resp_data, selections: this.state.selections})
                        console.log(data);
                        this.setState({dataIsBuilt: true, pdc: data});
                    });
                fetch("https://car-cs.herokuapp.com/static/assignments/js/ACM.json")
                    .then((response) => {
                        console.log(response);
                        return response.json();
                    })
                    .then((resp_data) => {
                        console.log(resp_data);
                        let data = buildData({cls: resp_data, selections: this.state.selections})
                        console.log(data);
                        this.setState({dataIsBuilt: true, acm: data});
                    });
            }
        );

  }
  render() {
      if (!this.state.dataIsBuilt) {
          let loading;
          if (this.state.selections) {
              loading = <CircularIndeterminate/>;
          } else {
              loading = <LinearIndeterminate/>;
          }
          return (
              <div className="App">
                  <ButtonAppBar/>
                  {loading}
              </div>
          )
      }
      else {
          let acm_data;
          let pdc_data;
          if (this.state.acm) {
              acm_data = <BasicSunburst data={this.state.acm}/>
          } else {
              acm_data = <CircularIndeterminate/>;
          }
          if (this.state.pdc) {
              pdc_data = <BasicSunburst data={this.state.pdc}/>
          } else {
              pdc_data = <CircularIndeterminate/>;
          }
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
                      {acm_data}
                  </div>
                  <div style={sunStyle}>
                      {pdc_data}
                  </div>
              </div>
          );
      }
  }
}


export default App;
