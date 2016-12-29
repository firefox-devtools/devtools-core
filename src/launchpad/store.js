const {
    applyMiddleware,
    combineReducers,
    createStore
} = require("redux");

const { thunk } = require("./utils/redux/middleware/thunk");
const reducers = require("./reducers");

console.log("reducers", reducers);

function configureStore() {
  const initialState = {
    expressions: []
  };

  return createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(thunk)
  );
}

module.exports = {
  configureStore
};
