import React, { Component } from 'react'
import './App.css'
//import * as d3 from 'd3'
import CircularIndeterminate from './Loading';
import {Sunburst} from "react-vis/es";

const myData = {
 "title": "analytics",
 "color": "#12939A",
 "children": [
  {
   "title": "cluster",
   "children": [
    {"title": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
    {"title": "CommunityStructure", "color": "#12939A", "size": 3812},
    {"title": "HierarchicalCluster", "color": "#12939A", "size": 6714},
    {"title": "MergeEdge", "color": "#12939A", "size": 743}
   ]
  },
  {
   "title": "graph",
   "children": [
    {"title": "BetweennessCentrality", "color": "#12939A", "size": 3534},
    {"title": "LinkDistance", "color": "#12939A", "size": 5731},
    {"title": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
    {"title": "ShortestPaths", "color": "#12939A", "size": 5914},
    {"title": "SpanningTree", "color": "#12939A", "size": 3416}
   ]
  },
  {
   "title": "optimization",
   "children": [
    {"title": "AspectRatioBanker", "color": "#12939A", "size": 7074}
   ]
  }
 ]
};



class CoverageGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }

    componentDidMount() {
        this.setState({data: true});
    }

    render() {
        if (!this.state.data) {
            return (
                <CircularIndeterminate/>
          )
        }
        else {
            console.log(myData);
            return <Sunburst
              hideRootNode
              colorType="literal"
              data={myData}
              height={900}
              width={1000}>
            </Sunburst>
        }
    }
}
export default CoverageGraph