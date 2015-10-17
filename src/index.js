#! /usr/bin/env node
"use strict";

// const fs = require("fs");
import fs from "fs";
import _ from "lodash";
const PEG = require("pegjs");

const qmlStructureGrammar = fs.readFileSync(
  "./src/qmlStructureGrammar.pegjs",
  "utf8"
);
const qmlStructureParser = PEG.buildParser(qmlStructureGrammar);

const getMetadomain = (structure) => {
  return structure.map((x) => {
    return x.metanominal;
  });
};

const getSuccessorPairs = (pwObj) => {
  return pwObj.successorsList
  .map((x) => {
    return {
      source: pwObj.metanominal,
      target: x
    };
  });
};

const getPwObj = (structure, pwString) => {
  return structure.filter((x) => x.metanominal === pwString)[0];
};

const getAllSuccessorPairs = (structure) => {
  const metadomain = getMetadomain(structure);
  const pairsList = metadomain.map((x) => {
    return getPwObj(structure, x);
  }).map((x) => {
    return getSuccessorPairs(x);
  });
  return _(pairsList).flattenDeep().value();
};



// structure2d3(
//  "{w1({a,b},{P,Q},{P1{a,b},P2{b}},{R1{(a,b)},R2{(a,a),(b,b)}},{w1,w2}),
//    w2({c},{P},{P{c}},{R{}},{w2}),w3({d},{Q},{P{d}},{R{(d,d)}},{w1,w2})}"
// )
const structure2d3 = (structureString) => {
  const structureParsed = qmlStructureParser.parse(structureString);
  return {
    nodes: structureParsed,
    links: getAllSuccessorPairs(structureParsed)
  };
};
// Structure2d3 = (structure) => {};

module.exports = {
  parser: qmlStructureParser,
  getD3: structure2d3,
  getLatex: "getLatex"
};


// tip library:
// http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js

/* tributary code:

var width = 960,
    height = 500;

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(40)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -50 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
    .style("stroke", "#4679BD")
    .style("opacity", "0.6");

//d3.json("graph.json", function(error, graph) {
//  if (error) throw error;

  var nodeById = d3.map();

  graph = {"nodes":[{"metanominal":"w1","domain":["a","b"],"nularyExtensions":["P","Q"],"unaryExtensions":[{"relation":"P1","arity":1,"extension":["a","b"]},{"relation":"P2","arity":1,"extension":["b"]}],"binaryExtensions":[{"relation":"R1","arity":2,"extension":["(a,b)"]},{"relation":"R2","arity":2,"extension":["(a,a)","(b,b)"]}],"successorsList":["w1","w2"]},{"metanominal":"w2","domain":["c"],"nularyExtensions":["P"],"unaryExtensions":[{"relation":"P","arity":1,"extension":["c"]}],"binaryExtensions":[{"relation":"R","arity":2,"extension":[]}],"successorsList":["w2"]},{"metanominal":"w3","domain":["d"],"nularyExtensions":["Q"],"unaryExtensions":[{"relation":"P","arity":1,"extension":["d"]}],"binaryExtensions":[{"relation":"R","arity":2,"extension":["(d,d)"]}],"successorsList":["w1","w2"]}],"links":[{"source":"w1","target":"w1"},{"source":"w1","target":"w2"},{"source":"w2","target":"w2"},{"source":"w3","target":"w1"},{"source":"w3","target":"w2"}]}

  //Set up tooltip
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .style('line-height', '1')
      .style('color', 'black')
      .offset([-50, 0])
      .html(function (d) {
        return  d.metanominal + ":</br>"
            + "domain: " + d.domain + "</br>"
            + "valuation: " + d.nularyExtensions + "</br>"
            + "predicates: </br>" + "&nbsp;&nbsp;&nbsp;" + JSON.stringify(d.unaryExtensions) + "</br>"
            + "relations: </br>"  + "&nbsp;&nbsp;&nbsp;" +  JSON.stringify(d.binaryExtensions) + "</br>"
            + "successors: " + d.successorsList + "</br>";
      })
  svg.call(tip);

  graph.nodes.forEach(function(node) {
    nodeById.set(node.metanominal, node);
  });

  graph.links.forEach(function(link) {
    link.source = nodeById.get(link.source);
    link.target = nodeById.get(link.target);
  });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke","#999")
      .style("stroke-width","1.5px")
      .style("marker-end", "url(#licensing)");

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
     .on('mouseover', tip.show) //Added
     .on('mouseout', tip.hide);

  node.append("circle")
    .attr("r", 8)
    .style("fill", "steelBlue")
    .style("stroke","#000")
    .style("stroke-width",".5px")

   node.append("text")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.metanominal })
      .style("font", "9px helvetica");

  //var node = svg.selectAll(".node")
  //    .data(graph.nodes)
  //  .enter().append("circle")
  //    .attr("class", "node")
  //    .attr("r", 6)
      // .style("fill", function(d) { return d.id; })

      //.call(force.drag);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke","#999")
        .style("stroke-width","1.5px")
        .style("marker-end", "url(#licensing)");

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        //.style("stroke","#000")
        //.style("stroke-width","1.5px");
    d3.selectAll("circle")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .style("stroke","#000")
      .style("stroke-width",".5px");
    d3.selectAll("text")
      .attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y; })
      .style("font", "10px helvetica");

  });
// });

*/
