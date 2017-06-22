/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { MODE } = require("../constants");
const { maxLengthMap } = require("../grip-array");
let stubs = new Map();

stubs.set("testBasic", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn0.obj35",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 1,
  "preview": {
    "kind": "ArrayLike",
    "length": 0,
    "items": []
  }
});

stubs.set("testMaxProps", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn1.obj35",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": 3,
    "items": [
      1,
      "foo",
      {
        "type": "object",
        "class": "Object",
        "actor": "server1.conn1.obj36",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0
      }
    ]
  }
});

stubs.set("testMoreThanShortMaxProps", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn1.obj35",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": maxLengthMap.get(MODE.SHORT) + 1,
  "preview": {
    "kind": "ArrayLike",
    "length": maxLengthMap.get(MODE.SHORT) + 1,
    "items": (new Array(maxLengthMap.get(MODE.SHORT) + 1)).fill("test string")
  }
});

stubs.set("testMoreThanLongMaxProps", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn1.obj35",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": maxLengthMap.get(MODE.LONG) + 1,
    "items": (new Array(maxLengthMap.get(MODE.LONG) + 1)).fill("test string")
  }
});

stubs.set("testPreviewLimit", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn1.obj31",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 12,
  "preview": {
    "kind": "ArrayLike",
    "length": 11,
    "items": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
});

stubs.set("testRecursiveArray", {
  "type": "object",
  "class": "Array",
  "actor": "server1.conn3.obj42",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 2,
  "preview": {
    "kind": "ArrayLike",
    "length": 1,
    "items": [
      {
        "type": "object",
        "class": "Array",
        "actor": "server1.conn3.obj43",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 2,
        "preview": {
          "kind": "ArrayLike",
          "length": 1
        }
      }
    ]
  }
});

stubs.set("testNamedNodeMap", {
  "type": "object",
  "class": "NamedNodeMap",
  "actor": "server1.conn3.obj42",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 6,
  "preview": {
    "kind": "ArrayLike",
    "length": 3,
    "items": [
      {
        "type": "object",
        "class": "Attr",
        "actor": "server1.conn3.obj43",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 2,
          "nodeName": "class",
          "value": "myclass"
        }
      },
      {
        "type": "object",
        "class": "Attr",
        "actor": "server1.conn3.obj44",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 2,
          "nodeName": "cellpadding",
          "value": "7"
        }
      },
      {
        "type": "object",
        "class": "Attr",
        "actor": "server1.conn3.obj44",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 2,
          "nodeName": "border",
          "value": "3"
        }
      }
    ]
  }
});

stubs.set("testNodeList", {
  "type": "object",
  "actor": "server1.conn1.child1/obj51",
  "class": "NodeList",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 3,
  "preview": {
    "kind": "ArrayLike",
    "length": 3,
    "items": [
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj52",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": true,
          "attributes": {
            "id": "btn-1",
            "class": "btn btn-log",
            "type": "button"
          },
          "attributesLength": 3
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj53",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": true,
          "attributes": {
            "id": "btn-2",
            "class": "btn btn-err",
            "type": "button"
          },
          "attributesLength": 3
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj54",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": true,
          "attributes": {
            "id": "btn-3",
            "class": "btn btn-count",
            "type": "button"
          },
          "attributesLength": 3
        }
      }
    ]
  }
});

stubs.set("testDisconnectedNodeList", {
  "type": "object",
  "actor": "server1.conn1.child1/obj51",
  "class": "NodeList",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 3,
  "preview": {
    "kind": "ArrayLike",
    "length": 3,
    "items": [
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj52",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": false,
          "attributes": {
            "id": "btn-1",
            "class": "btn btn-log",
            "type": "button"
          },
          "attributesLength": 3
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj53",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": false,
          "attributes": {
            "id": "btn-2",
            "class": "btn btn-err",
            "type": "button"
          },
          "attributesLength": 3
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj54",
        "class": "HTMLButtonElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "button",
          "isConnected": false,
          "attributes": {
            "id": "btn-3",
            "class": "btn btn-count",
            "type": "button"
          },
          "attributesLength": 3
        }
      }
    ]
  }
});

stubs.set("testDocumentFragment", {
  "type": "object",
  "actor": "server1.conn1.child1/obj45",
  "class": "DocumentFragment",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "DOMNode",
    "nodeType": 11,
    "nodeName": "#document-fragment",
    "childNodesLength": 5,
    "childNodes": [
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj46",
        "class": "HTMLLIElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "li",
          "attributes": {
            "id": "li-0",
            "class": "list-element"
          },
          "attributesLength": 2
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj47",
        "class": "HTMLLIElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "li",
          "attributes": {
            "id": "li-1",
            "class": "list-element"
          },
          "attributesLength": 2
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj48",
        "class": "HTMLLIElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "li",
          "attributes": {
            "id": "li-2",
            "class": "list-element"
          },
          "attributesLength": 2
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj49",
        "class": "HTMLLIElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "li",
          "attributes": {
            "id": "li-3",
            "class": "list-element"
          },
          "attributesLength": 2
        }
      },
      {
        "type": "object",
        "actor": "server1.conn1.child1/obj50",
        "class": "HTMLLIElement",
        "extensible": true,
        "frozen": false,
        "sealed": false,
        "ownPropertyLength": 0,
        "preview": {
          "kind": "DOMNode",
          "nodeType": 1,
          "nodeName": "li",
          "attributes": {
            "id": "li-4",
            "class": "list-element"
          },
          "attributesLength": 2
        }
      }
    ]
  }
});

stubs.set("Array(5)", {
  "type": "object",
  "actor": "server1.conn4.child1/obj33",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 1,
  "preview": {
    "kind": "ArrayLike",
    "length": 5,
    "items": [
      null,
      null,
      null,
      null,
      null
    ]
  }
});

stubs.set("[,1,2,3]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj35",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": 4,
    "items": [
      null,
      1,
      2,
      3
    ]
  }
});

stubs.set("[,,,3,4,5]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj37",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      null,
      null,
      null,
      3,
      4,
      5
    ]
  }
});

stubs.set("[0,1,,3,4,5]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj65",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 6,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      0,
      1,
      null,
      3,
      4,
      5
    ]
  }
});

stubs.set("[0,1,,,,5]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj83",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      0,
      1,
      null,
      null,
      null,
      5
    ]
  }
});

stubs.set("[0,,2,,4,5]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj85",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 5,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      0,
      null,
      2,
      null,
      4,
      5
    ]
  }
});

stubs.set("[0,,,3,,,,7,8]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj87",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 5,
  "preview": {
    "kind": "ArrayLike",
    "length": 9,
    "items": [
      0,
      null,
      null,
      3,
      null,
      null,
      null,
      7,
      8
    ]
  }
});

stubs.set("[0,1,2,3,4,,]", {
  "type": "object",
  "actor": "server1.conn4.child1/obj89",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 6,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      0,
      1,
      2,
      3,
      4,
      null
    ]
  }
});

stubs.set("[0,1,2,,,,]", {
  "type": "object",
  "actor": "server1.conn13.child1/obj88",
  "class": "Array",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "ArrayLike",
    "length": 6,
    "items": [
      0,
      1,
      2,
      null,
      null,
      null
    ]
  }
});

module.exports = stubs;
