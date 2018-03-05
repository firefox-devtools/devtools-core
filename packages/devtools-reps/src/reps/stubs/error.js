/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const stubs = new Map();
stubs.set("SimpleError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1020",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "Error",
    "message": "Error message",
    "stack": "@debugger eval code:1:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 1,
    "columnNumber": 13
  }
});

stubs.set("MultilineStackError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1021",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "Error",
    "message": "bar",
    "stack": "errorBar@debugger eval code:6:15\n" +
             "errorFoo@debugger eval code:3:3\n" +
             "@debugger eval code:8:1\n",
    "fileName": "debugger eval code",
    "lineNumber": 6,
    "columnNumber": 15
  }
});

stubs.set("ErrorWithoutStacktrace", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1020",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "Error",
    "message": "Error message",
  }
});

stubs.set("EvalError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1022",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "EvalError",
    "message": "EvalError message",
    "stack": "@debugger eval code:10:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 10,
    "columnNumber": 13
  }
});

stubs.set("InternalError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1023",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "InternalError",
    "message": "InternalError message",
    "stack": "@debugger eval code:11:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 11,
    "columnNumber": 13
  }
});

stubs.set("RangeError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1024",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "RangeError",
    "message": "RangeError message",
    "stack": "@debugger eval code:12:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 12,
    "columnNumber": 13
  }
});

stubs.set("ReferenceError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1025",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "ReferenceError",
    "message": "ReferenceError message",
    "stack": "@debugger eval code:13:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 13,
    "columnNumber": 13
  }
});

stubs.set("SyntaxError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1026",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "SyntaxError",
    "message": "SyntaxError message",
    "stack": "@debugger eval code:14:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 14,
    "columnNumber": 13
  }
});

stubs.set("TypeError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1027",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "TypeError",
    "message": "TypeError message",
    "stack": "@debugger eval code:15:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 15,
    "columnNumber": 13
  }
});

stubs.set("URIError", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1028",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "URIError",
    "message": "URIError message",
    "stack": "@debugger eval code:16:13\n",
    "fileName": "debugger eval code",
    "lineNumber": 16,
    "columnNumber": 13
  }
});

/**
 * Example code:
 *  try {
 *    var foo = document.querySelector("foo;()bar!");
 *  } catch (ex) {
 *    ex;
 *  }
 */
stubs.set("DOMException", {
  "type": "object",
  "actor": "server2.conn2.child3/obj32",
  "class": "DOMException",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "DOMException",
    "name": "SyntaxError",
    "message": "'foo;()bar!' is not a valid selector",
    "code": 12,
    "result": 2152923148,
    "filename": "debugger eval code",
    "lineNumber": 1,
    "columnNumber": 0
  }
});

stubs.set("base-loader Error", {
  "type": "object",
  "actor": "server1.conn1.child1/obj1020",
  "class": "Error",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Error",
    "name": "Error",
    "message": "Error message",
    "stack":
      "onPacket@resource://devtools/shared/base-loader.js -> resource://devtools/shared/client/debugger-client.js:856:9\n" +
      "send/<@resource://devtools/shared/base-loader.js -> resource://devtools/shared/transport/transport.js:569:13\n" +
      "exports.makeInfallible/<@resource://devtools/shared/base-loader.js -> resource://devtools/shared/ThreadSafeDevToolsUtils.js:109:14\n" +
      "exports.makeInfallible/<@resource://devtools/shared/base-loader.js -> resource://devtools/shared/ThreadSafeDevToolsUtils.js:109:14\n",
    "fileName": "debugger-client.js",
    "lineNumber": 859,
    "columnNumber": 9
  }
});

module.exports = stubs;
