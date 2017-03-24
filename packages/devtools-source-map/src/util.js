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

/**
 * Returns true if the specified URL and/or content type are specific to
 * JavaScript files.
 *
 * @return boolean
 *         True if the source is likely JavaScript.
 */
function isJavaScript(url: string, contentType: string = ""): boolean {
  return (url && /\.(jsm|js)?$/.test(trimUrlQuery(url))) ||
         contentType.includes("javascript");
}

function getContentType(url: string) {
  if (isJavaScript(url)) {
    return "text/javascript";
  }

  if (url.match(/ts$/)) {
    return "text/typescript";
  }

  if (url.match(/tsx$/)) {
    return "text/typescript-jsx";
  }

  if (url.match(/jsx$/)) {
    return "text/jsx";
  }

  if (url.match(/coffee$/)) {
    return "text/coffeescript";
  }

  if (url.match(/elm$/)) {
    return "text/elm";
  }

  if (url.match(/cljs$/)) {
    return "text/x-clojure";
  }

  return "text/plain";
}

module.exports = {
  originalToGeneratedId,
  generatedToOriginalId,
  isOriginalId,
  isGeneratedId,
  getContentType,
};
