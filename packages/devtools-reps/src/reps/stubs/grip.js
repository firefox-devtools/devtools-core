/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { MODE } = require("../constants");
const { maxLengthMap } = require("../grip");

let stubs = new Map();

stubs.set("testBasic", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj304",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {}
  }
});

stubs.set("testMaxProps", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj337",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 3,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "a": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": "a"
      },
      "b": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": "b"
      },
      "c": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": "c"
      }
    },
    "ownPropertiesLength": 3,
    "safeGetterValues": {}
  }
});

const longModeMaxLength = maxLengthMap.get(MODE.LONG);

stubs.set("testMoreThanMaxProps", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj332",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": longModeMaxLength + 1,
  "preview": {
    "kind": "Object",
    "ownProperties": Array.from({length: longModeMaxLength + 1})
      .reduce((res, item, index) => Object.assign(res, {
        ["p" + index]: {
          "configurable": true,
          "enumerable": true,
          "writable": true,
          "value": index.toString()
        }
      }), {}),
    "ownPropertiesLength": longModeMaxLength + 1,
    "safeGetterValues": {}
  }
});

stubs.set("testUninterestingProps", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj342",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "a": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
          "type": "undefined"
        }
      },
      "b": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
          "type": "undefined"
        }
      },
      "c": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": "c"
      },
      "d": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": 1
      }
    },
    "ownPropertiesLength": 4,
    "safeGetterValues": {}
  }
});
stubs.set("testNonEnumerableProps", {
  "type": "object",
  "actor": "server1.conn1.child1/obj30",
  "class": "Object",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 1,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 1,
    "safeGetterValues": {}
  }
});
stubs.set("testNestedObject", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj145",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 2,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "objProp": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
          "type": "object",
          "class": "Object",
          "actor": "server1.conn0.obj146",
          "extensible": true,
          "frozen": false,
          "sealed": false,
          "ownPropertyLength": 1
        }
      },
      "strProp": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": "test string"
      }
    },
    "ownPropertiesLength": 2,
    "safeGetterValues": {}
  }
});

stubs.set("testNestedArray", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj326",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 1,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "arrProp": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
          "type": "object",
          "class": "Array",
          "actor": "server1.conn0.obj327",
          "extensible": true,
          "frozen": false,
          "sealed": false,
          "ownPropertyLength": 4,
          "preview": {
            "kind": "ArrayLike",
            "length": 3
          }
        }
      }
    },
    "ownPropertiesLength": 1,
    "safeGetterValues": {}
  },
});

stubs.set("testMoreProp", {
  "type": "object",
  "class": "Object",
  "actor": "server1.conn0.obj342",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "a": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
          "type": "undefined"
        }
      },
      "b": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": 1
      },
      "more": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": 2
      },
      "d": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": 3
      }
    },
    "ownPropertiesLength": 4,
    "safeGetterValues": {}
  }
});
stubs.set("testBooleanObject", {
  "type": "object",
  "actor": "server1.conn1.child1/obj57",
  "class": "Boolean",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {},
    "wrappedValue": true
  }
});
stubs.set("testNumberObject", {
  "type": "object",
  "actor": "server1.conn1.child1/obj59",
  "class": "Number",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {},
    "wrappedValue": 42
  }
});
stubs.set("testStringObject", {
  "type": "object",
  "actor": "server1.conn1.child1/obj61",
  "class": "String",
  "ownPropertyLength": 4,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 4,
    "safeGetterValues": {},
    "wrappedValue": "foo"
  }
});
stubs.set("testProxy", {
  "type": "object",
  "actor": "server1.conn1.child1/obj47",
  "class": "Proxy",
  "proxyTarget": {
    "type": "object",
    "actor": "server1.conn1.child1/obj48",
    "class": "Object",
    "ownPropertyLength": 1
  },
  "proxyHandler": {
    "type": "object",
    "actor": "server1.conn1.child1/obj49",
    "class": "Array",
    "ownPropertyLength": 4,
    "preview": {
      "kind": "ArrayLike",
      "length": 3
    }
  },
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "<target>": {
        "value": {
          "type": "object",
          "actor": "server1.conn1.child1/obj48",
          "class": "Object",
          "ownPropertyLength": 1
        }
      },
      "<handler>": {
        "value": {
          "type": "object",
          "actor": "server1.conn1.child1/obj49",
          "class": "Array",
          "ownPropertyLength": 4,
          "preview": {
            "kind": "ArrayLike",
            "length": 3
          }
        }
      }
    },
    "ownPropertiesLength": 2
  }
});
stubs.set("testArrayBuffer", {
  "type": "object",
  "actor": "server1.conn1.child1/obj170",
  "class": "ArrayBuffer",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {
      "byteLength": {
        "getterValue": 10,
        "getterPrototypeLevel": 1,
        "enumerable": false,
        "writable": true
      }
    }
  }
});
stubs.set("testSharedArrayBuffer", {
  "type": "object",
  "actor": "server1.conn1.child1/obj171",
  "class": "SharedArrayBuffer",
  "extensible": true,
  "frozen": false,
  "sealed": false,
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {
      "byteLength": {
        "getterValue": 5,
        "getterPrototypeLevel": 1,
        "enumerable": false,
        "writable": true
      }
    }
  }
});
stubs.set("testApplicationCache", {
  "type": "object",
  "actor": "server2.conn1.child2/obj45",
  "class": "OfflineResourceList",
  "ownPropertyLength": 0,
  "preview": {
    "kind": "Object",
    "ownProperties": {},
    "ownPropertiesLength": 0,
    "safeGetterValues": {
      "status": {
        "getterValue": 0,
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onchecking": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onerror": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onnoupdate": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "ondownloading": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onprogress": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onupdateready": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "oncached": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "onobsolete": {
        "getterValue": {
          "type": "null"
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      },
      "mozItems": {
        "getterValue": {
          "type": "object",
          "actor": "server2.conn1.child2/obj46",
          "class": "DOMStringList",
          "extensible": true,
          "frozen": false,
          "sealed": false,
          "ownPropertyLength": 0,
          "preview": {
            "kind": "ArrayLike",
            "length": 0
          }
        },
        "getterPrototypeLevel": 1,
        "enumerable": true,
        "writable": true
      }
    }
  }
});
stubs.set("testObjectWithNodes", {
  "type": "object",
  "actor": "server1.conn1.child1/obj214",
  "class": "Object",
  "ownPropertyLength": 2,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "foo": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
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
              "id": "btn-1",
              "class": "btn btn-log",
              "type": "button"
            },
            "attributesLength": 3
          }
        }
      },
      "bar": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
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
              "id": "btn-2",
              "class": "btn btn-err",
              "type": "button"
            },
            "attributesLength": 3
          }
        }
      }
    },
    "ownPropertiesLength": 2,
    "safeGetterValues": {}
  }
});
stubs.set("testObjectWithDisconnectedNodes", {
  "type": "object",
  "actor": "server1.conn1.child1/obj214",
  "class": "Object",
  "ownPropertyLength": 2,
  "preview": {
    "kind": "Object",
    "ownProperties": {
      "foo": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
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
            "attributes": {
              "id": "btn-1",
              "class": "btn btn-log",
              "type": "button"
            },
            "attributesLength": 3
          }
        }
      },
      "bar": {
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": {
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
            "attributes": {
              "id": "btn-2",
              "class": "btn btn-err",
              "type": "button"
            },
            "attributesLength": 3
          }
        }
      }
    },
    "ownPropertiesLength": 2,
    "safeGetterValues": {}
  }
});

module.exports = stubs;
