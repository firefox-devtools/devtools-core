const React = require("react");
const ReactDOM = require("react-dom");
const Draggable = React.createFactory(require("./Draggable"));
const { DOM: dom, PropTypes } = React;

/**
 * This component represents a Splitter. The splitter supports vertical
 * as well as horizontal mode.
 */
const SplitBox = React.createClass({

  propTypes: {
    // Custom class name. You can use more names separated by a space.
    className: PropTypes.string,
    // Initial size of controlled panel.
    initialSize: PropTypes.any,
    // Optional initial width of controlled panel.
    initialWidth: PropTypes.number,
    // Optional initial height of controlled panel.
    initialHeight: PropTypes.number,
    // Left/top panel
    startPanel: PropTypes.any,
    // Left/top panel collapse state.
    startPanelCollapsed: PropTypes.bool,
    // Min panel size.
    minSize: PropTypes.any,
    // Max panel size.
    maxSize: PropTypes.any,
    // Right/bottom panel
    endPanel: PropTypes.any,
    // Right/bottom panel collapse state.
    endPanelCollapsed: PropTypes.bool,
    // True if the right/bottom panel should be controlled.
    endPanelControl: PropTypes.bool,
    // Size of the splitter handle bar.
    splitterSize: PropTypes.number,
    // True if the splitter bar is vertical (default is vertical).
    vert: PropTypes.bool,
    // Optional style properties passed into the splitbox
    style: PropTypes.object
  },

  displayName: "SplitBox",

  getDefaultProps() {
    return {
      splitterSize: 5,
      vert: true,
      endPanelControl: false,
      endPanelCollapsed: false,
      startPanelCollapsed: false
    };
  },

  /**
   * The state stores the current orientation (vertical or horizontal)
   * and the current size (width/height). All these values can change
   * during the component's life time.
   */
  getInitialState() {
    return {
      vert: this.props.vert,
      // We use integers for these properties
      width: parseInt(this.props.initialWidth || this.props.initialSize),
      height: parseInt(this.props.initialHeight || this.props.initialSize)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.vert !== nextProps.vert) {
      this.setState({ vert: nextProps.vert });
    }
  },

  // Dragging Events

  /**
   * Set 'resizing' cursor on entire document during splitter dragging.
   * This avoids cursor-flickering that happens when the mouse leaves
   * the splitter bar area (happens frequently).
   */
  onStartMove() {
    const splitBox = ReactDOM.findDOMNode(this);
    const doc = splitBox.ownerDocument;
    let defaultCursor = doc.documentElement.style.cursor;
    doc.documentElement.style.cursor =
      (this.state.vert ? "ew-resize" : "ns-resize");

    splitBox.classList.add("dragging");

    this.setState({
      defaultCursor: defaultCursor
    });
  },

  onStopMove() {
    const splitBox = ReactDOM.findDOMNode(this);
    const doc = splitBox.ownerDocument;
    doc.documentElement.style.cursor = this.state.defaultCursor;

    splitBox.classList.remove("dragging");
  },

  /**
   * Adjust size of the controlled panel. Depending on the current
   * orientation we either remember the width or height of
   * the splitter box.
   */
  onMove({ movementX, movementY }) {
    const node = ReactDOM.findDOMNode(this);
    const doc = node.ownerDocument;

    if (this.props.endPanelControl) {
      // For the end panel we need to increase the width/height when the
      // movement is towards the left/top.
      movementX = -movementX;
      movementY = -movementY;
    }

    if (this.state.vert) {
      const isRtl = doc.dir === "rtl";
      if (isRtl) {
        // In RTL we need to reverse the movement again -- but only for vertical
        // splitters
        movementX = -movementX;
      }

      this.setState((state, props) => ({
        width: state.width + movementX
      }));
    } else {
      this.setState((state, props) => ({
        height: state.height + movementY
      }));
    }
  },

  // Rendering
  preparePanelStyles() {
    const vert = this.state.vert;
    const {
      minSize, maxSize, startPanelCollapsed, endPanelControl,
      endPanelCollapsed } = this.props;
    let leftPanelStyle, rightPanelStyle;

    // Set proper size for panels depending on the current state.
    if (vert) {
      let startWidth = endPanelControl ? null : this.state.width,
        endWidth = endPanelControl ? this.state.width : null;

      leftPanelStyle = {
        maxWidth: endPanelControl ? null : maxSize,
        minWidth: endPanelControl ? null : minSize,
        width: startPanelCollapsed ? 0 : startWidth
      };
      rightPanelStyle = {
        maxWidth: endPanelControl ? maxSize : null,
        minWidth: endPanelControl ? minSize : null,
        width: endPanelCollapsed ? 0 : endWidth
      };
    } else {
      let startHeight = endPanelControl ? null : this.state.height,
        endHeight = endPanelControl ? this.state.height : null;

      leftPanelStyle = {
        maxHeight: endPanelControl ? null : maxSize,
        minHeight: endPanelControl ? null : minSize,
        height: endPanelCollapsed ? maxSize : startHeight
      };
      rightPanelStyle = {
        maxHeight: endPanelControl ? maxSize : null,
        minHeight: endPanelControl ? minSize : null,
        height: startPanelCollapsed ? maxSize : endHeight
      };
    }

    return { leftPanelStyle, rightPanelStyle };
  },

  render() {
    const vert = this.state.vert;
    const {
      startPanelCollapsed,
      startPanel,
      endPanel,
      endPanelControl,
      splitterSize,
      endPanelCollapsed
    } = this.props;

    let style = Object.assign({}, this.props.style);

    // Calculate class names list.
    let classNames = ["split-box"];
    classNames.push(vert ? "vert" : "horz");
    if (this.props.className) {
      classNames = classNames.concat(this.props.className.split(" "));
    }

    const { leftPanelStyle, rightPanelStyle } = this.preparePanelStyles();

    // Calculate splitter size
    let splitterStyle = {
      flex: `0 0 ${splitterSize}px`
    };

    return (
      dom.div({
        className: classNames.join(" "),
        style: style },
        !startPanelCollapsed ?
          dom.div({
            className: endPanelControl ? "uncontrolled" : "controlled",
            style: leftPanelStyle },
            startPanel
          ) : null,
        Draggable({
          className: "splitter",
          style: splitterStyle,
          onStart: this.onStartMove,
          onStop: this.onStopMove,
          onMove: this.onMove
        }),
        !endPanelCollapsed ?
          dom.div({
            className: endPanelControl ? "controlled" : "uncontrolled",
            style: rightPanelStyle },
            endPanel
          ) : null
      )
    );
  }
});

module.exports = SplitBox;
