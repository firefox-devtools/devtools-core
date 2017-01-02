const constants = require("../constants");
const expressionsActions = require("./expressions");
const { generateKey } = require("../utils/utils");

function addInput(input) {
  return ({ dispatch }) => {
    dispatch(expressionsActions.evaluateInput(input));

    dispatch({
      key: generateKey(),
      type: constants.ADD_INPUT,
      value: input,
    });
  };
}

function changeCurrentInput(input) {
  return {
    type: constants.CHANGE_CURRENT_INPUT,
    value: input,
  };
}

function navigateInputHistory(dir) {
  return {
    type: constants.NAVIGATE_INPUT_HISTORY,
    value: dir,
  };
}

module.exports = {
  addInput,
  changeCurrentInput,
  navigateInputHistory,
};
