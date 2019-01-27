import React, { Component } from 'react';
import './App.css';
//import CoverageGraph from './CoverageGraph'
import DrawerAppBar from "./PersistentDrawer";
import CircularIndeterminate from './Loading';
import BasicSunburst from './basic-sunburst';
import LinearIndeterminate from './LinearIndeterminate'
import buildData, { buildTreeData, compareAssignments } from './utils';
import Grid from "@material-ui/core/Grid";
import CoverageGraph from "./CoverageGraph";
import SimilarityGraph from "./SimilarityGraph";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import Typography from "@material-ui/core/es/Typography/Typography";

class App extends Component {
  constructor(props){
    super(props);
    let nifty = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87];
    let itcs_3145 = [99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119];
    let peachy = [88,89,90,91,92,93,94,95,96,97,98];

    this.state = {
        data: false,
        selections: false,
        dataIsBuilt: false,
        acm: false,
        pdc: false,
        acm_data: false,
        acm_data_tree: false,
        pdc_data: false,
        pdc_data_tree: false,
        sim_data: false,
        sets: {
            nifty: nifty,
            itcs_3145: itcs_3145,
            peachy: peachy
        },
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
  }

  updateSelections(selections) {
      this.setState({dataIsBuilt: false}, () => this.updateSelectionsState(selections));
  }

  updateSelectionsState(selections, to) {
      let resp_data = {};
      if (selections === undefined) {
          resp_data['assignments'] = this.state.selections['assignments'];
          resp_data['classifications'] = this.state.selections['classifications'];
      } else {
          let go = [];
          for (let item in this.state.selections['assignments']) {
              let curr = this.state.selections['assignments'][item];
              if (selections.includes(curr.pk)) {
                  go[go.length] = curr;
              }
          }
          resp_data['classifications'] = this.state.selections['classifications'];
          resp_data['assignments'] = go;
      }
      let sets = this.state.sets;
      let nifty_set = this.state.selections.assignments.filter(function (e) {
          return sets.nifty.includes(e.pk);
      });
      let peachy_set = this.state.selections.assignments.filter(function (e) {
          return sets.peachy.includes(e.pk);
      });

      //console.log(resp_data);
      //console.log(this.state);
      let sim_data = compareAssignments({from: nifty_set, to: peachy_set});
      //let pdc_data = buildData({cls: this.state.pdc, selections: resp_data});
      let pdc_data_tree = buildTreeData({cls: this.state.pdc, selections: resp_data, ignore: 'ACM'});
      //let acm_data = buildData({cls: this.state.acm, selections: resp_data});
      let acm_data_tree = buildTreeData({cls: this.state.acm, selections: resp_data, ignore: 'PDC'});
      //console.log(pdc_data_tree);
      this.setState({
          sim_data: sim_data,
          //acm_data: acm_data,
          acm_data_tree: acm_data_tree,
          //pdc_data: pdc_data,
          pdc_data_tree: pdc_data_tree,
          dataIsBuilt: true,
      });

  }

    componentDidMount() {
        let get = new Promise( (resolve, reject) => {
                fetch("https://car-cs.herokuapp.com/data/")
                    .then((response) => {
                        //console.log(response);
                        return response.json()
                    })
                    .then((resp_data) => {
                        //console.log(resp_data);
                        this.setState({data: resp_data, selections: resp_data});
                        if (this.state.acm && this.state.pdc) {
                            resolve("done")
                        }
                    });
                fetch("https://car-cs.herokuapp.com/static/assignments/js/pdc.json")
                    .then((response) => {
                        //console.log(response);
                        return response.json();
                    })
                    .then((resp_data) => {
                        //console.log(resp_data);
                        this.setState({pdc: resp_data});
                        if (this.state.data && this.state.acm) {
                            resolve("done")
                        }
                    });
                fetch("https://car-cs.herokuapp.com/static/assignments/js/ACM.json")
                    .then((response) => {
                        //console.log(response);
                        return response.json();
                    })
                    .then((resp_data) => {
                        //console.log(resp_data);
                        this.setState({acm: resp_data});
                        if (this.state.data && this.state.pdc) {
                            resolve("done")
                        }
                    });
            }
        );

        get.then(() => {
            this.updateSelections();
        });
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
              case 'All Assignments':
                  this.updateSelections();
                  break;
              case 'Peachy':
                  this.updateSelections(this.state.sets.peachy);
                  break;
              case 'ITCS 3145':
                  this.updateSelections(this.state.sets.itcs_3145);
                  break;
              case 'Nifty':
                  this.updateSelections(this.state.sets.nifty);
                  break;
              case 'home':
                  this.setState({data: false});
                  window.location = "/";
                  break;
              case 'coverage':
                  this.setState({data: false});
                  window.location = "/coverage";
                  break;
              case 'similarity':
                  this.setState({data: false});
                  window.location = "similarity";
                  break;
              default:
                  console.log(targetID);
          }
      }
  }

  render() {
      console.log(this.state);
      if (!this.state.data) {
          let loading;
          if (this.state.selections) {
              loading = <CircularIndeterminate/>;
          } else {
              loading = <LinearIndeterminate/>;
          }
          return (
              <div className="App">
                  <DrawerAppBar/>
                  <div style={{
                      marginTop: '70px'
                  }
                  } />
                  <div>
                      {loading}
                  </div>
              </div>
          )
      }
      else {
          //let acm_data;
          let acm_graph;
          //let pdc_data;
          let pdc_graph;
          let sim_graph;
          if (this.state.dataIsBuilt) {
              //acm_data = <BasicSunburst data={this.state.acm_data}/>
              acm_graph = <CoverageGraph data={this.state.acm_data_tree}/>
              //pdc_data = <BasicSunburst data={this.state.pdc_data}/>
              pdc_graph = <CoverageGraph data={this.state.pdc_data_tree}/>
              sim_graph = <SimilarityGraph data={this.state.sim_data}/>
          } else {
              //acm_data = <CircularIndeterminate/>;
              acm_graph = <CircularIndeterminate/>;
              //pdc_data = <CircularIndeterminate/>;
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
                      <DrawerAppBar onClick={this.handleClick} onKeyPress={this.handleChange}/>
                  </div>
                  <div style={{
                      marginTop: '70px'
                  }
                  } />
                  <Grid>
                      <div style={sunStyle}>
                          <Router>
                              <Switch>
                                  {/*<Route path="/similarity/:set" component={() => {}}/>*/}
                                  <Route path="/coverage" component={() => {
                                      return (
                                          <div>
                                              <div>
                                                  <Toolbar>
                                                      <Button id="All Assignments" color="inherit"
                                                              onClick={this.handleClick}
                                                      >All Assignments</Button>
                                                      <Button id="Nifty" color="inherit"
                                                              onClick={this.handleClick}
                                                      >Nifty</Button>
                                                      <Button id="Peachy" color="inherit"
                                                              onClick={this.handleClick}
                                                      >Peachy</Button>
                                                      <Button id="ITCS 3145" color="inherit"
                                                              onClick={this.handleClick}
                                                      >ITCS 3145</Button>
                                                  </Toolbar>
                                              </div>
                                              <div>
                                                  <Typography variant="h6" color="inherit">
                                                      ACM-IEEE CS2013 Coverage Graph
                                                  </Typography>
                                                  {acm_graph}
                                                  <Typography variant="h6" color="inherit">
                                                      PDC12 Coverage Graph
                                                  </Typography>
                                                  {pdc_graph}
                                              </div>
                                          </div>
                                      )
                                  }}/>
                                  <Route path="/similarity" component={() => {
                                      return (
                                          <div>
                                              {sim_graph}
                                          </div>
                                      )
                                  }}/>
                                  <Route path="/" component={() => {
                                    return (
                                        <div>
                                            <Button id="coverage" color="inherit"
                                                    onClick={this.handleClick}
                                            >Coverage Graphs</Button>
                                            <Button id="similarity" color="inherit"
                                                    onClick={this.handleClick}
                                            >Similarity Graph</Button>
                                        </div>
                                  )
                                  }}/>
                              </Switch>
                          </Router>
                      </div>
                  </Grid>
              </div>
          );
      }
  }
}


export default App;
