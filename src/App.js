import React, { Component } from 'react';
import './App.css';
//import CoverageGraph from './CoverageGraph'
import ButtonAppBar from './HeaderBar';
import CircularIndeterminate from './Loading';
import BasicSunburst from './basic-sunburst';
import LinearIndeterminate from './LinearIndeterminate'
import buildData, { buildTreeData } from './utils';
import Grid from "@material-ui/core/Grid";
import CoverageGraph from "./CoverageGraph";

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
        selections: false,
        dataIsBuilt: false,
        acm: false,
        acm_tree: false,
        pdc: false,
        pdc_tree: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  updateSelections(selections) {
      this.setState({dataIsBuilt: false, acm: false, pdc: false, acm_tree: false, pdc_tree: false});
      fetch("https://car-cs.herokuapp.com/data/" + selections)
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
                        let data = buildData({cls: resp_data, selections: this.state.selections});
                        let data_tree = buildTreeData({cls: resp_data, selections: this.state.selections, ignore: 'ACM'});
                        console.log(data_tree);
                        this.setState({dataIsBuilt: true, pdc: data, pdc_tree: data_tree});
                    });
                fetch("https://car-cs.herokuapp.com/static/assignments/js/ACM.json")
                    .then((response) => {
                        console.log(response);
                        return response.json();
                    })
                    .then((resp_data) => {
                        console.log(resp_data);
                        let data = buildData({cls: resp_data, selections: this.state.selections});
                        let data_tree = buildTreeData({cls: resp_data, selections: this.state.selections, ignore: 'PDC'});
                        this.setState({dataIsBuilt: true, acm: data, acm_tree: data_tree});
                    });
            }
        );
  }
  componentDidMount() {
      this.updateSelections("");
  }


  handleChange(event) {
      if (event.key === "Enter") {
          this.updateSelections("?assignments=" + event.target.value);
      }
  }

  handleClick(event) {
      let target = event.target;
      if (target !== undefined) {
          let targetID = target.id;
          switch (targetID) {
              case 'btn-All':
                  this.updateSelections("")
                  break;
              case 'btn-Peachy':
                  this.updateSelections("?assignments=88,89,90,91,92,93,94,95,96,97,98,")
                  break;
              case 'btn-3145':
                  this.updateSelections("?assignments=99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119")
                  break;
              default:
                  console.log(targetID);
          }
      }
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
          let acm_graph;
          let pdc_data;
          let pdc_graph;
          if (this.state.acm) {
              acm_data = <BasicSunburst data={this.state.acm}/>
              acm_graph = <CoverageGraph data={this.state.acm_tree}/>
          } else {
              acm_data = <CircularIndeterminate/>;
              acm_graph = <CircularIndeterminate/>;
          }
          if (this.state.pdc) {
              pdc_data = <BasicSunburst data={this.state.pdc}/>
              pdc_graph = <CoverageGraph data={this.state.pdc_tree}/>
          } else {
              pdc_data = <CircularIndeterminate/>;
              pdc_graph = <CircularIndeterminate/>;
          }
          let sunStyle = {
              display: 'flex',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
          };
          return (
              <div className="App">
                  <div>
                      <ButtonAppBar onClick={this.handleClick} onKeyPress={this.handleChange}/>
                  </div>
                  <Grid>
                      <div style={sunStyle}>
                          {acm_data}
                          {pdc_data}
                      </div>
                      <div>
                          {acm_graph}
                          {pdc_graph}
                      </div>
                  </Grid>
              </div>
          );
      }
  }
}


export default App;
