import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3'
import CircularIndeterminate from './Loading';
import {Card, CardContent} from "@material-ui/core";

class CoverageGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.createGraph = this.createGraph.bind(this);
    }

    componentDidMount() {
        console.log(this.state.data);
        this.createGraph();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.createGraph();
    }

    createGraph() {
        const node = this.node;
        let data = this.state.data;

        let code = 0;

        let zoom = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[-100, -100], [1000 + 90,  1000 + 100]])
            .on("zoom", zoomed);

        let view = d3.select(node).append("g")
            .attr("class", "view")
            .attr("x", 0.5)
            .attr("y", 0.5)
            //.attr("fill", "none")

        let color_scale = d3.scaleLinear()
            .domain([1, 100])
            .range([88, 50]);

        d3.select(node).call(zoom);

        let scale = ['#79c6e6', 'hsl(0, 100%, ', 'hsl(120, 100%, ','hsl(60, 100%, ', 'hsl(180, 100%, ','hsl(180, 100%, ','hsl(180, 100%, ','hsl(180, 100%, ',];
        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {
                return 100/((d.source.depth+(2/0.75)));
            }).strength(.75))
            .force("collide", d3.forceCollide( function(d) { return 50/((d.depth+1)/0.75) } ))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(500, 500))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0));

        console.log(this.state.data);
        let link = view.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.state.data.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                 if (d.hits === 0) {
                    return 1;
                }
                else {
                    return 2;
                }
            })
            .attr("stroke", function(d){
                if (d.hits === 0) {
                    return 'grey';
                }
                else {
                    return 'black';
                }
            })
            .attr("stroke-dasharray", function(d) {
                if (d.hits === 0) {
                    return '1';
                }
                else {
                    return '';
                }
            })
            // prevent lines from catching mouse focus
            .style("pointer-events", "none");

        let nodes = view.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.state.data.nodes)
            .enter().append("circle")
            .attr("r", function(d) { return (20/(1 + d.depth)); })
            .attr("id", function(d) { return d.id; })
            //.on("mouseover", function(d) { d3.select(this).style("opacity", 1 ); })
            //.on("mouseout", function(d) { d3.select(this).style("opacity", 0.5); })
            // .on("click", function(d) {
            //     console.log(d);
            // })
            //.style("opacity", 0.5)
            .on('mouseover', function(d, i) {
                d3.select("#tooltip").transition()
                    .duration(200)
                    .style("opacity", 0.9);
                d3.select("#tooltip").html(d.id + ': ' + d.hits + ("<br />"))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function(d, i) {
                d3.select("#tooltip").transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            .style("opacity", (d) => {
              if (d.hits === 0) {
                  return 0.7;
              } else {
                  return 1;
              }
            })
            .style("fill", function(d) {
                if (d.hits === 0) {
                    return 'white';
                }
                else {
                    if (d.depth === 0) {
                        return scale[0];
                    } else {
                        color_scale.domain([1, data['max'][d.depth]]);
                        return scale[d.depth] + color_scale(d.hits) + "%";
                    }
                }
            })
            .attr("stroke", function(d){
                if (d.hits === 0) {
                    return 'grey';
                }
                else {
                    return 'black';
                }
            })
            .attr("stroke-dasharray", function(d) {
                if (d.hits === 0) {
                    return '1';
                }
                else {
                    return '';
                }
            });

        nodes.append("title")
            .text(function(d) { return d.id + ": " + d.hits; });

        let text = view.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
            .attr("dx", function(d){return -20})
            .text(function(d) { if (d.depth === 1) {
                return code++ + "";
            } return "";
            });

        let ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            text
                .attr("dx", function(d) { return d.x})
                .attr("dy", function (d) { return d.y});
        };

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(data.links);

        function zoomed() {
            view.attr("transform", d3.event.transform);
        }

    }

    render() {
        if (!this.state.data) {
            return (
                <CircularIndeterminate/>
          )
        }
        else {
            return (
                <Card>
                    <CardContent>
                        <svg ref={node => this.node = node}
                             width={1000} height={1000}>
                        </svg>
                    </CardContent>
                </Card>
            );
        }
    }
}
export default CoverageGraph