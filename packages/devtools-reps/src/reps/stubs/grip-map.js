/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { MODE } = require("../constants");
const { maxLengthMap } = require("../grip-map");

let stubs = new Map();

stubs.set("testEmptyMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj97",
  "class": "Map",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 0,
    "entries": []
  }
});

stubs.set("testSymbolKeyedMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj118",
  "class": "Map",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 2,
    "entries": [
      [
        {
          "type": "symbol",
          "name": "a"
        },
        "value-a"
      ],
      [
        {
          "type": "symbol",
          "name": "b"
        },
        "value-b"
      ]
    ]
  }
});

stubs.set("testWeakMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj115",
  "class": "WeakMap",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 1,
    "entries": [
      [
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj116",
          "class": "Object",
          "extensible": true,
          "frozen": false,
          "sealed": false,
          "ownPropertyLength": 1
        },
        "value-a"
      ]
    ]
  }
});

stubs.set("testMaxEntries", {
  "type": "object",
  "actor": "server1.conn1.child1/obj109",
  "class": "Map",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 3,
    "entries": [
      [
        "key-a",
        "value-a"
      ],
      [
        "key-b",
        "value-b"
      ],
      [
        "key-c",
        "value-c"
      ]
    ]
  }
});

stubs.set("testMoreThanMaxEntries", {
  "type": "object",
  "class": "Map",
  "actor": "server1.conn0.obj332",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": maxLengthMap.get(MODE.LONG) + 1,
    "entries": Array.from({length: 10}).map((_, i) => {
      return [`key-${i}`, `value-${i}`];
    })
  }
});

stubs.set("testUninterestingEntries", {
  "type": "object",
  "actor": "server1.conn1.child1/obj111",
  "class": "Map",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 4,
    "entries": [
      [
        "key-a",
        {
          "type": "null"
        }
      ],
      [
        "key-b",
        {
          "type": "undefined"
        }
      ],
      [
        "key-c",
        "value-c"
      ],
      [
        "key-d",
        4
      ]
    ]
  }
});

stubs.set("testDisconnectedNodeValuedMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj213",
  "class": "Map",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 3,
    "entries": [
      [
        "item-0",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj214",
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
        }
      ],
      [
        "item-1",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj215",
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
        }
      ],
      [
        "item-2",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj216",
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
    ]
  }
});

stubs.set("testNodeValuedMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj213",
  "class": "Map",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 3,
    "entries": [
      [
        "item-0",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj214",
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
        }
      ],
      [
        "item-1",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj215",
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
        }
      ],
      [
        "item-2",
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj216",
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
    ]
  }
});

stubs.set("testNodeKeyedMap", {
  "type": "object",
  "actor": "server1.conn1.child1/obj223",
  "class": "WeakMap",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "MapLike",
    "size": 3,
    "entries": [
      [
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj224",
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
        "item-0"
      ],
      [
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj225",
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
        },
        "item-2"
      ],
      [
        {
          "type": "object",
          "actor": "server1.conn1.child1/obj226",
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
        "item-1"
      ]
    ]
  }
});

module.exports = stubs;
