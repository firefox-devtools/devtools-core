const constants = require("../constants");
const Immutable = require("immutable");

const initialState = Immutable.Map();

function update(state = initialState, action) {
  const { type, value, object } = action;
  switch (type) {
    case constants.LOAD_OBJECT:
      return state.set(
        value.properties.from,
        value.properties
      );
  }

  return state;
}

module.exports = update;
