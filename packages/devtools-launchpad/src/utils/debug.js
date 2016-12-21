const { isDevelopment, isTesting } = require("devtools-config");

function debugGlobal(field, value) {
  if (isDevelopment() || isTesting()) {
    window[field] = value;
  }
}

module.exports = {
  debugGlobal
};
