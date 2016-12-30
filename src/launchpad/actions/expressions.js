const constants = require("../constants");
const { generateKey } = require("../utils/utils");

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
    key: generateKey(),
    type: constants.ADD_EXPRESSION,
    value: {
      input,
      packet,
    },
  };
}

function clearExpressions() {
  return {
    type: constants.CLEAR_EXPRESSIONS
  };
}

function showResultPacket(key) {
  return {
    key,
    type: constants.SHOW_RESULT_PACKET,
  };
}

function hideResultPacket(key) {
  return {
    key,
    type: constants.HIDE_RESULT_PACKET,
  };
}

module.exports = {
  addExpression,
  clearExpressions,
  evaluateInput,
  showResultPacket,
  hideResultPacket,
};
