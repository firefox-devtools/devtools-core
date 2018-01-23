const PropTypes = require("prop-types");

const { wrapRender } = require("../reps/rep-utils");
const { MODE } = require("../reps/constants");
const { ModePropType } = require("../reps/array");

const dom = require("react-dom-factories");
const { span } = dom;

GripLengthBubble.propTypes = {
  object: PropTypes.object.isRequired,
  maxLengthMap: PropTypes.instanceOf(Map).isRequired,
  getLength: PropTypes.func.isRequired,
  mode: ModePropType,
  visibilityThreshold: PropTypes.number
};

function GripLengthBubble(props) {
  const {
    object,
    mode = MODE.SHORT,
    visibilityThreshold = 5,
    maxLengthMap,
    getLength
  } = props;

  const length = getLength(object);
  const isEmpty = length === 0;
  const isObvious = [MODE.SHORT, MODE.LONG].includes(mode) &&
    length <= maxLengthMap.get(mode) &&
    length <= visibilityThreshold;
  if (isEmpty || isObvious) {
    return "";
  }

  return span({
    className: "objectLengthBubble"
  }, `(${length})`);
}

module.exports = {
  lengthBubble: wrapRender(GripLengthBubble),
};
