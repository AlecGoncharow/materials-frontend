import React, { Component } from 'react';
import './App.css';
//import CoverageGraph from './CoverageGraph'
import ButtonAppBar from './HeaderBar';
import CircularIndeterminate from './Loading';
import BasicSunburst from './basic-sunburst';
import LinearIndeterminate from './LinearIndeterminate'
import buildData, { buildTreeData, similarityData } from './utils';
import Grid from "@material-ui/core/Grid";
import CoverageGraph from "./CoverageGraph";
import SimilarityGraph from "./SimilarityGraph";

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
        sim_data: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  updateSelections(selections) {
      this.setState({dataIsBuilt: false, acm: false, pdc: false, acm_tree: false, pdc_tree: false, sim_data: false});
      fetch("https://car-cs.herokuapp.com/data/" + selections)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((resp_data) => {
          console.log(resp_data);
          let sim_data = similarityData({selections: resp_data});
          console.log(sim_data)
          this.setState({selections: resp_data, dataIsBuilt: false, sim_data: sim_data});
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
              case 'btn-Nifty':
                  this.updateSelections("?assignments= 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87")
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
          let sim_graph;
          if (this.state.acm && this.state.pdc) {
              acm_data = <BasicSunburst data={this.state.acm}/>
              acm_graph = <CoverageGraph data={this.state.acm_tree}/>
              pdc_data = <BasicSunburst data={this.state.pdc}/>
              pdc_graph = <CoverageGraph data={this.state.pdc_tree}/>
              sim_graph = <SimilarityGraph data={this.state.sim_data}/>
          } else {
              acm_data = <CircularIndeterminate/>;
              acm_graph = <CircularIndeterminate/>;
              pdc_data = <CircularIndeterminate/>;
              pdc_graph = <CircularIndeterminate/>;
              sim_graph = <CircularIndeterminate/>
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
                          {acm_graph}
                      </div>
                      <div style={sunStyle}>
                          {pdc_data}
                          {pdc_graph}
                      </div>
                      <div>
                          {sim_graph}
                      </div>
                  </Grid>
              </div>
          );
      }
  }
}


export default App;
