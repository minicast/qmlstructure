#! /usr/bin/env node

const fs = require("fs");
const PEG = require("pegjs");

let qmlStructureGrammar = fs.readFileSync(
  "./src/qmlStructureGrammar.pegjs",
  "utf8"
);
let qmlStructureParser = PEG.buildParser(qmlStructureGrammar);

module.exports = {
  parse: qmlStructureParser,
  graph2d3: "graph2d3"
};
