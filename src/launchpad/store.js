const {
    applyMiddleware,
    combineReducers,
    createStore
} = require("redux");

const {promise} = require("./utils/redux/middleware/promise");
const {thunk} = require("./utils/redux/middleware/thunk");
const reducers = require("./reducers");

function configureStore(options) {
  return createStore(
    combineReducers(reducers),
    applyMiddleware(
      thunk(options.makeThunkArgs),
      promise
    )
  );
}

module.exports = {
  configureStore
};
