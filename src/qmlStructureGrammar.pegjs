/* jshint ignore: start */
/* eslint-disable */
/*
 * QML Structure Grammar
 * ============================
 *
 * Accepts QML model expressions & parses them in JSON format.
 *
 * (see an example at the end of the file)
 *
 */

{
  function combine(first, rest, combiners) {
    var result = first, i;

    for (i = 0; i < rest.length; i++) {
      result = combiners[rest[i][1]](result, rest[i][3]);
    }

    return result;
  }
}

structure "structure"
  //= possibleWorldsList
  // possibleWorld
  = "{" _ possibleWorldsList:possibleWorldsList _ "}" {
    return possibleWorldsList
  }

possibleWorldsList "possibleWorldsList"
  = head:(possibleWorld)* _ tail:("," _ possibleWorld)* {
    return head.concat(tail.map((x) => x[1]))
  }

possibleWorld "possibleWorld"
  = metanominal:metanominal _ "(" _
    "{" _ domain:constantsList _ "}" _ "," _
    "{" nularyExtensionsList:nularyExtensionsList "}" _ "," _
    "{" unaryExtensionsList:unaryExtensionsList "}" _ "," _
    "{" binaryExtensionsList:binaryExtensionsList "}" _ "," _
    "{" successorsList:metanominalsList "}" _
  ")" {
    return {
      metanominal: metanominal,
      domain: domain,
      nularyExtensions: nularyExtensionsList,
      unaryExtensions: unaryExtensionsList,
      binaryExtensions: binaryExtensionsList,
      successorsList: successorsList,
    }
  }

metanominalsSet "metanominalsSet"
  = "{" metanominalsList:metanominalsList "}" {
    return metanominalsList
  }

metanominalsList "metanominalsList"
  = head:(metanominal)* tail:("," metanominal)* {
    return head.concat(tail.map((x) => x[1]))
  }

tuple4 "tuple4"
  = "(" constant "," constant "," constant "," constant ")" {
    return "(" + c1 + "," + c2 + ")"
  }
tuple3 "tuple3"
  = "(" constant "," constant "," constant ")"  {
    return "(" + c1 + "," + c2 + ")"
  }

binaryExtensionsList "binaryExtensionsList"
  = _ head:(binaryExtension)* _ tail:("," binaryExtension)* _ {
    return head.concat(tail.map((x) => x[1]))
  }

binaryExtension "binaryExtension"
  = _ relation:relation _ tuples2Set:tuples2Set _ {
    return {
      relation: relation,
      arity: 2,
      extension: tuples2Set
    }
  }

tuples2Set "tuples2Set"
  = "{" _ tuples2List:tuples2List _ "}" {
    return tuples2List
  }

tuples2List "tuples2List"
  = _ head:(tuple2)* _ tail:("," tuple2)* _ {
    return head.concat(tail.map((x) => x[1]))
  }

tuple2 "tuple2"
  = "(" c1:constant "," c2:constant ")" {
    return "(" + c1 + "," + c2 + ")"
  }

unaryExtensionsSet "unaryExtensionsSet"
  = _ "{" _ unaryExtensionsList:unaryExtensionsList _ "}" _ {
    return { unaryExtensions: unaryExtensionsList }
  }

unaryExtensionsList "unaryExtensionsList"
  = _ head:(unaryExtension)* _ tail:("," unaryExtension)* _ {
    return head.concat(tail.map((x) => x[1]))
  }

unaryExtension "unaryExtension"
  = _ relation:relation _ tuples1Set:tuples1Set _ {
    return {
      relation: relation,
      arity: 1,
      extension: tuples1Set
    }
  }

tuples1Set "tuples1Set"
  = "{" tuples1List:tuples1List "}" {
    return tuples1List
  }

tuples1List "tuples1List"
  = head:(tuple1)* tail:("," tuple1)* {
    return head.concat(tail.map((x) => x[1]))
  }

tuple1 "tuple1" = "(" constant ")" / constant

nularyExtensionsList "nularyExtensionsList"
  = head:(relation)* tail:("," relation)* {
    return head.concat(tail.map((x) => x[1]))
  }

constantsList "constantsList"
  = head:(constant)* tail:("," constant)* {
    return head.concat(tail.map((x) => x[1]))
  }


metanominal "metanominal"
  = metanominalString:[wvtl]+ index:index {
    return metanominalString.join("") + index
  }

relation "relation"
  = relationString:[P-S]+ index:index {
    return relationString.join("") + index
  }

constant "constant"
  = constantString:[a-e]+ index:index {
    return constantString.join("") + index
  }

index "index" = digits:[0-9]* {
  return digits.join("")
}

_ "whitespace" = [ \t\n\r]*

/* EXAMPLE:

the QML structure ... :

{w1({a,a,b},{P,Q},{R{a,b},P{a}},{R2{(a,b)},P2{(a,a),(b,b)}},{w1,w2}),w2({a,a,b},{P,Q},{R{a,b},P{a}},{R2{(a,b)},P2{(a,a),(b,b)}},{w1,w2})}

... which can be also written more explicitly as ... :

{
  w1
  (
    {a,a,b},
    {P,Q},
    {R{a,b},P{a}},
    {R2{(a,b)},P2{(a,a),(b,b)}},
    {w1,w2}
  ),
  w2
  (
    {a,a,b},
    {P,Q},
    {R{a,b},P{a}},
    {R2{(a,b)},P2{(a,a),(b,b)}},
    {w1,w2}
  )
}

... gets parsed in the following JSON format:

[
   {
      "metanominal": "w1",
      "domain": [
        "a", "a", "b"
      ],
      "nularyExtensions": [
        "P", "Q"
      ],
      "unaryExtensions": [
         {
            "relation": "R", "arity": 1,
            "extension": [ "a","b" ]
         },
         {
            "relation": "P", "arity": 1,
            "extension": [ "a" ]
         }
      ],
      "binaryExtensions": [
         {
            "relation": "R2", "arity": 2,
            "extension": [ "(a,b)" ]
         },
         {
            "relation": "P2",
            "arity": 2,
            "extension": [ "(a,a)", "(b,b)" ]
         }
      ],
      "successorsList": [
         "w1",
         "w2"
      ]
   },
   []
]

example 1: "{w1({a,b},{P,R0},{P{a},R1{a,b}},{R2{(a,b)},S{(a,b),(b,a)}},{w1})}"

*/
