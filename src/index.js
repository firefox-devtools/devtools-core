const React = require("react");

const { MODE } = require("./reps/constants");
const Rep = React.createFactory(require("./reps/rep"));
const Grip = require("./reps/grip");

module.exports = {
  Rep,
  Grip,
  MODE
};
