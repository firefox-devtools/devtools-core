const constants = require("../constants");

function evaluateInput(evaluate, input) {
  return (dispatch) => {
    evaluate(input, {})
      .then(packet => dispatch(addExpression(input, packet)))
      .catch(err => console.warn("Error when evaluating expression", err));
  };
}

function addExpression(input, packet) {
  return {
    type: constants.ADD_EXPRESSION,
    value: {
      input,
      packet,
    }
  };
}

function clearExpressions() {
  return {
    type: constants.CLEAR_EXPRESSIONS
  };
}

module.exports = {
  addExpression,
  clearExpressions,
  evaluateInput,
};
