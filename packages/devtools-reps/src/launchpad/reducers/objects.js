const constants = require("../constants");
const Immutable = require("immutable");

const initialState = {
  properties: Immutable.Map(),
  entries: Immutable.Map(),
};

function update(state = initialState, action) {
  const { type, value } = action;
  const {
    entries,
    properties,
  } = state;

  switch (type) {
    case constants.LOAD_PROPERTIES:
      return Object.assign({}, state, {
        properties: properties.set(
          value.properties.from,
          value.properties
        )
      });
    case constants.LOAD_ENTRIES:
      return Object.assign({}, state, {
        entries: entries.set(
          value.actor,
          value.entries
        )
      });
  }

  return state;
}

module.exports = update;
