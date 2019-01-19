import React, { Component } from 'react'
import './App.css'
//import * as d3 from 'd3'
import CircularIndeterminate from './Loading';
import {Sunburst} from "react-vis/es";

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

        }
    }
}
export default CoverageGraph