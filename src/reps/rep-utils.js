// Dependencies
const React = require("react");

// Utils
const nodeConstants = require("../shared/dom-node-constants");

/**
 * Create React factories for given arguments.
 * Example:
 *   const { Rep } = createFactories(require("./rep"));
 */
function createFactories(args) {
  let result = {};
  for (let p in args) {
    result[p] = React.createFactory(args[p]);
  }
  return result;
}

/**
 * Returns true if the given object is a grip (see RDP protocol)
 */
function isGrip(object) {
  return object && object.actor;
}

function escapeNewLines(value) {
  return value.replace(/\r/gm, "\\r").replace(/\n/gm, "\\n");
}

function cropMultipleLines(text, limit) {
  return escapeNewLines(cropString(text, limit));
}

function cropString(text, limit, alternativeText) {
  if (!alternativeText) {
    alternativeText = "\u2026";
  }

  // Make sure it's a string and sanitize it.
  text = sanitizeString(text + "");

  // Crop the string only if a limit is actually specified.
  if (!limit || limit <= 0) {
    return text;
  }

  // Set the limit at least to the length of the alternative text
  // plus one character of the original text.
  if (limit <= alternativeText.length) {
    limit = alternativeText.length + 1;
  }

  let halfLimit = (limit - alternativeText.length) / 2;

  if (text.length > limit) {
    return text.substr(0, Math.ceil(halfLimit)) + alternativeText +
      text.substr(text.length - Math.floor(halfLimit));
  }

  return text;
}

function sanitizeString(text) {
  // Replace all non-printable characters, except of
  // (horizontal) tab (HT: \x09) and newline (LF: \x0A, CR: \x0D),
  // with unicode replacement character (u+fffd).
  // eslint-disable-next-line no-control-regex
  let re = new RegExp("[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\x9F]", "g");
  return text.replace(re, "\ufffd");
}

function parseURLParams(url) {
  url = new URL(url);
  return parseURLEncodedText(url.searchParams);
}

function parseURLEncodedText(text) {
  let params = [];

  // In case the text is empty just return the empty parameters
  if (text == "") {
    return params;
  }

  let searchParams = new URLSearchParams(text);
  let entries = [...searchParams.entries()];
  return entries.map(entry => {
    return {
      name: entry[0],
      value: entry[1]
    };
  });
}

function getFileName(url) {
  let split = splitURLBase(url);
  return split.name;
}

function splitURLBase(url) {
  if (!isDataURL(url)) {
    return splitURLTrue(url);
  }
  return {};
}

function getURLDisplayString(url) {
  return cropString(url);
}

function isDataURL(url) {
  return (url && url.substr(0, 5) == "data:");
}

function splitURLTrue(url) {
  const reSplitFile = /(.*?):\/{2,3}([^\/]*)(.*?)([^\/]*?)($|\?.*)/;
  let m = reSplitFile.exec(url);

  if (!m) {
    return {
      name: url,
      path: url
    };
  } else if (m[4] == "" && m[5] == "") {
    return {
      protocol: m[1],
      domain: m[2],
      path: m[3],
      name: m[3] != "/" ? m[3] : m[2]
    };
  }

  return {
    protocol: m[1],
    domain: m[2],
    path: m[2] + m[3],
    name: m[4] + m[5]
  };
}

/**
 * Wrap the provided render() method of a rep in a try/catch block that will render a
 * fallback rep if the render fails.
 */
function wrapRender(renderMethod) {
  return function () {
    try {
      return renderMethod.call(this);
    } catch (e) {
      return React.DOM.span(
        {
          className: "objectBox objectBox-failure",
          title: "This object could not be rendered, " +
                 "please file a bug on bugzilla.mozilla.org"
        },
        /* Labels have to be hardcoded for reps, see Bug 1317038. */
        "Invalid object");
    }
  };
}

/**
 * Get an array of all the items from the grip in parameter (including the grip itself)
 * which can be selected in the inspector.
 *
 * @param {Object} Grip
 * @return {Array} Flat array of the grips which can be selected in the inspector
 */
function getSelectableInInspectorGrips(grip) {
  let grips = new Set(getFlattenedGrips([grip]));
  return [...grips].filter(isGripSelectableInInspector);
}

/**
 * Indicate if a Grip can be selected in the inspector,
 * i.e. if it represents a node element.
 *
 * @param {Object} Grip
 * @return {Boolean}
 */
function isGripSelectableInInspector(grip) {
  return grip
    && typeof grip === "object"
    && grip.preview
    && [
      nodeConstants.TEXT_NODE,
      nodeConstants.ELEMENT_NODE
    ].includes(grip.preview.nodeType);
}

/**
 * Get a flat array of all the grips and their preview items.
 *
 * @param {Array} Grips
 * @return {Array} Flat array of the grips and their preview items
 */
function getFlattenedGrips(grips) {
  return grips.reduce((res, grip) => {
    let previewItems = getGripPreviewItems(grip);
    let flatPreviewItems = previewItems.length > 0
      ? getFlattenedGrips(previewItems)
      : [];

    return [...res, grip, ...flatPreviewItems];
  }, []);
}

/**
 * Get preview items from a Grip.
 *
 * @param {Object} Grip from which we want the preview items
 * @return {Array} Array of the preview items of the grip, or an empty array
 *                 if the grip does not have preview items
 */
function getGripPreviewItems(grip) {
  if (!grip) {
    return [];
  }

  // Promise resolved value Grip
  if (grip.promiseState && grip.promiseState.value) {
    return [grip.promiseState.value];
  }

  // Array Grip
  if (grip.preview && grip.preview.items) {
    return grip.preview.items;
  }

  // Node Grip
  if (grip.preview && grip.preview.childNodes) {
    return grip.preview.childNodes;
  }

  // Set or Map Grip
  if (grip.preview && grip.preview.entries) {
    return grip.preview.entries.reduce((res, entry) => res.concat(entry), []);
  }

  // Event Grip
  if (grip.preview && grip.preview.target) {
    return [grip.preview.target];
  }

  // Generic Grip
  if (grip.preview && grip.preview.ownProperties) {
    let propertiesValues = Object.values(grip.preview.ownProperties)
      .map(property => property.value || property);

    // ArrayBuffer Grip
    if (grip.preview.safeGetterValues) {
      propertiesValues = propertiesValues.concat(
        Object.values(grip.preview.safeGetterValues)
          .map(property => property.getterValue || property)
      );
    }

    return propertiesValues;
  }

  return [];
}

module.exports = {
  createFactories,
  isGrip,
  cropString,
  sanitizeString,
  wrapRender,
  cropMultipleLines,
  parseURLParams,
  parseURLEncodedText,
  getFileName,
  getURLDisplayString,
  getSelectableInInspectorGrips,
};
