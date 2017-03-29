const clipboardHelper = require("./shared/clipboard");
const { CurlUtils } = require("./client/shared/curl");
const FileSaver = require("./client/shared/file-saver");
const networkRequest = require("./client/shared/shim/networkRequest");
const { PluralForm } = require("./shared/plural-form");
const Services = require("./client/shared/shim/Services");
const SplitBox = require("./client/shared/components/splitter/SplitBox");
const sprintf = require("./shared/sprintf").sprintf;
const workerUtils = require("./shared/worker-utils");

module.exports = {
  clipboardHelper,
  CurlUtils,
  FileSaver,
  networkRequest,
  PluralForm,
  Services,
  SplitBox,
  sprintf,
  workerUtils,
};
