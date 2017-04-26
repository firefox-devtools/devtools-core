// @flow

const md5 = require("md5");

function originalToGeneratedId(originalId: string) {
  const match = originalId.match(/(.*)\/originalSource/);
  return match ? match[1] : "";
}

function generatedToOriginalId(generatedId: string, url: string) {
  return `${generatedId}/originalSource-${md5(url)}`;
}

function isOriginalId(id: string) {
  return !!id.match(/\/originalSource/);
}

function isGeneratedId(id: string) {
  return !isOriginalId(id);
}

/**
 * Trims the query part or reference identifier of a URL string, if necessary.
 */
function trimUrlQuery(url: string): string {
  let length = url.length;
  let q1 = url.indexOf("?");
  let q2 = url.indexOf("&");
  let q3 = url.indexOf("#");
  let q = Math.min(q1 != -1 ? q1 : length,
                   q2 != -1 ? q2 : length,
                   q3 != -1 ? q3 : length);

  return url.slice(0, q);
}

// Map suffix to content type.
const contentMap = {
  "js": "text/javascript",
  "jsm": "text/javascript",
  "ts": "text/typescript",
  "tsx": "text/typescript-jsx",
  "jsx": "text/jsx",
  "coffee": "text/coffeescript",
  "elm": "text/elm",
  "cljs": "text/x-clojure",
};

/**
 * Returns the content type for the specified URL.  If no specific
 * content type can be determined, "text/plain" is returned.
 *
 * @return String
 *         The content type.
 */
function getContentType(url: string) {
  url = trimUrlQuery(url);
  let dot = url.lastIndexOf(".");
  if (dot >= 0) {
    let name = url.substring(dot + 1);
    if (name in contentMap) {
      return contentMap[name];
    }
  }
  return "text/plain";
}

module.exports = {
  originalToGeneratedId,
  generatedToOriginalId,
  isOriginalId,
  isGeneratedId,
  getContentType,
  contentMapForTesting: contentMap,
};
