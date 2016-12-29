const constants = require("../constants");

const initialState = [];

function update(state = initialState, action) {
  const { type, value } = action;
  switch (type) {
    case constants.ADD_EXPRESSION:
      return [value, ...state];

    case constants.CLEAR_EXPRESSIONS:
      return [];
  }

  return state;
}

module.exports = update;
