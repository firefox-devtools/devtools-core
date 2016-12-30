const constants = require("../constants");

function evaluateInput(input) {
  return async function ({dispatch, client}) {
    if (!client) {
      console.warn("No client");
      return;
    }

    try {
      const packet = await client.clientCommands.evaluate(input, {});
      dispatch(addExpression(input, packet));
    } catch (err) {
      console.warn("Error when evaluating expression", err)
    }
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
