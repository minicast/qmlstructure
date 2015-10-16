/* eslint no-unused-expressions: false */
/* jshint -W030 */

const expect = require('chai').expect;
const qmlStructure = require('./index.js');

describe("qmlStructureParser", function () {
  describe("parser", function () {
    it("should parse a qml structure", function () {
      expect(qmlStructure.parser.parse(
        `{
          w1(
            {a,b},
            {P,R0},
            {
              P{a},
              R1{a,b}
            },
            {
              R2{(a,b)},
              S{(a,b),(b,a)}
            },
            {w1}
          )
        }`
      )).to.deep.equal(
        JSON.parse(
          `[{
            "metanominal":"w1",
            "domain":["a","b"],
            "nularyExtensions":[
              "P",
              "R0"
            ],
            "unaryExtensions":[
              {
                "relation":"P", "arity":1,
                "extension":["a"]
              },
              {
                "relation":"R1", "arity":1,
                "extension":["a","b"]}
            ],
            "binaryExtensions":[
              {
                "relation":"R2", "arity":2,
                "extension":["(a,b)"]
              },
              {
                "relation":"S", "arity":2,
                "extension":["(a,b)","(b,a)"]}
            ],
            "successorsList":["w1"]
          }]`
        )
      );
    });
  });
  describe("getD3", function () {
    it("should return a D3 force layout graph", function () {
      expect(qmlStructure.getD3(
        `{
          w1(
            {a,b},
            {P,R0},
            {   P{a},   R1{a,b}   },
            {   R2{(a,b)},  S{(a,b),(b,a)}   },
            {w1}
          )
        }`
      )).to.deep.equal(
        JSON.parse(
          `{
            "nodes":[
              {
                "metanominal":"w1",
                "domain":["a","b"],
                "nularyExtensions":["P","R0"],
                "unaryExtensions":[
                  {"relation":"P","arity":1,"extension":["a"]},
                  {"relation":"R1","arity":1,"extension":["a","b"]}
                ],
                "binaryExtensions":[
                  {"relation":"R2","arity":2,"extension":["(a,b)"]},
                  {"relation":"S","arity":2,"extension":["(a,b)","(b,a)"]}
                ],
                "successorsList":["w1"]
              }
            ],
            "links":[
              {"source":"w1","target":"w1"}
            ]
          }`
        )
      );
    });
  });
});
