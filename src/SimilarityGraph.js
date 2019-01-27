import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3'
import CircularIndeterminate from './Loading';
import {Card, CardContent} from "@material-ui/core";

class SimilarityGraph extends Component {
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

        let zoom = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[-100, -100], [1000 + 90,  1000 + 100]])
            .on("zoom", zoomed);

        let view = d3.select(node).append("g")
            .attr("class", "view")
            .attr("x", 0.5)
            .attr("y", 0.5)
            //.attr("fill", "none")

        d3.select(node).call(zoom);

        let scale = ['#79c6e6', '#e6141c'];
        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {
                return 100/d.value;
            }).strength(.75))
            .force("collide", d3.forceCollide( function(d) { return 50 } ))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(500, 500))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0));

        let link = view.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.state.data.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                    return d.value;
            })
            .attr("stroke", function(d){
                if (d.value === 0) {
                    return 'grey';
                }
                else {
                    return 'black';
                }
            })
            .attr("stroke-dasharray", function(d) {
                if (d.value === 0) {
                    return '1';
                }
                else {
                    return '';
                }
            })
        link.append("title")
            .text(function (d) {
                return d.label;
            });

        let nodes = view.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.state.data.nodes)
            .enter().append("circle")
            .attr("r", function(d) { return 10; })
            .attr("id", function(d) { return d.id; })
            //.on("mouseover", function(d) { d3.select(this).style("opacity", 1 ); })
            //.on("mouseout", function(d) { d3.select(this).style("opacity", 0.5); })
            // .on("click", function(d) {
            //     console.log(d);
            // })
            //.style("opacity", 0.5)
            .style("fill", function(d) {
                if (d.to) {
                    return scale[1];
                } else {
                    return scale[0];
                }
            })
            .attr("stroke", function(d){
                return 'black';
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        nodes.append("title")
            .text(function(d) { return d.id });


        let ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        };

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(data.links);

        function zoomed() {
            view.attr("transform", d3.event.transform);
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
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
export default SimilarityGraph