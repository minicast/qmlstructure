/* eslint no-unused-expressions: false */
/* jshint -W030 */

// const expect = require('chai').expect;
import {expect} from 'chai';
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

    it("should throw on badly formed input", function () {
      const illFormedInput = function() {
        qmlStructure.parser.parse(`badInput`);
      };
      expect(illFormedInput).to.throw();
    });

    it("should (not yet) parse input with 3 and 4 tuples", function () {
      const input3and4 = function() {
        qmlStructure.parser.parse(`{
          w1(
            {a,b,c,d},
            {P,R0},
            {
              P{a},
              R1{a,b}
            },
            {
              R2{(a,b)},
              S{(a,b),(b,a)}
            },
            {
              R3{(a,b,c),(b,c,a)}
            },
            {
              R2{(a,b,c,d),(a,d,b,c)}
            },
            {w1,w2}
          )
        }`);
      };
      // expect(input3and4).to.not.throw();
      expect(input3and4).to.throw();
    });

    it("should fail on malformed inputs", function () {
      const malformedInput1 = function() {
        qmlStructure.parser.parse(`{
          w1(
            {a,b,c,d},
            {P,R0},
            {
              R1{a,b}
            },
            {
              S{(a,b),(b,a)}
            },
            {w1,w2}
          ),X
        }`);
      };
      expect(malformedInput1).to.throw();
    });
    it("should not fail on well formed inputs", function () {
      const wellFormedInput1 = function() {
        qmlStructure.parser.parse(`{
          w1(
            {a,b,c,d},
            {P,R0},
            {
              R1{a,b}
            },
            {
              S{(a,b),(b,a)}
            },
            {w1,w2}
          ),
          w2(
            {a},
            {P},
            {
              R1{a,b}
            },
            {
              S{(a,b),(b,a)}
            },
            {w1,w2}
          )
        }`);
      };
      expect(wellFormedInput1).to.not.throw();
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
