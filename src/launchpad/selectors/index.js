function getExpressions(state) {
  return state.expressions;
}

function getInputState(state) {
  return state.input;
}

function getCurrentInputValue(state) {
  return getInputState(state).get("currentValue");
}

module.exports = {
  getCurrentInputValue,
  getExpressions,
};
