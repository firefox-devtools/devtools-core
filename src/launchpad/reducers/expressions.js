const constants = require("../constants");
const Immutable = require("immutable");

const initialState = Immutable.Map();

function update(state = initialState, action) {
  const { type, value, key } = action;

  switch (type) {
    case constants.ADD_EXPRESSION:
      return state.set(key, Immutable.Map(value));

    case constants.CLEAR_EXPRESSIONS:
      return state.clear();

    case constants.SHOW_RESULT_PACKET:
      return state.mergeIn([key], {showPacket: true});

    case constants.HIDE_RESULT_PACKET:
      return state.mergeIn([key], {showPacket: false});
  }

  return state;
}

module.exports = update;
