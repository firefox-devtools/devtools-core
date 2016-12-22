const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { MODE } = require("../../reps/constants");
const Rep = createFactory(require("../../reps/rep"));
const Grip = require("../../reps/grip");

const Result = React.createClass({
  propTypes: {
    expression: PropTypes.object.isRequired
  },

  displayName: "Result",

  getInitialState: function() {
    return {
      showPacket: false
    };
  },

  copyPacketToClipboard: function(e, packet) {
    e.stopPropagation();

    var textField = document.createElement('textarea');
    textField.innerHTML = JSON.stringify(packet, null, "  ");
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  },

  onHeaderClick: function() {
    this.setState(prevState => ({
      showPacket: !prevState || !prevState.showPacket
    }));
  },

  renderRepInAllModes: function({ object }) {
    return Object.keys(MODE).map(modeKey =>
       this.renderRep({ object, modeKey })
     );
  },

  renderRep: function({ object, modeKey }) {
    return dom.div(
      {
        className: `rep-element ${modeKey}`,
        key: JSON.stringify(object) + modeKey,
        "data-mode": modeKey,
      },
      Rep({ object, defaultRep: Grip, mode: MODE[modeKey] })
    );
  },

  renderPacket: function(packet) {
    let showPacket = this.state && this.state.showPacket === true;
    let headerClassName = showPacket ? "packet-expanded" : "packet-collapsed";
    let headerLabel = showPacket ? "Hide expression packet" : "Show expression packet";

    return dom.div({ className: "packet" },
      dom.header({
          className: headerClassName,
          onClick: this.onHeaderClick,
        },
        headerLabel,
        showPacket && dom.button({
          className: "copy-packet-button",
          onClick: (e) => this.copyPacketToClipboard(e, packet)
        }, "Copy as JSON")
      ),
      showPacket &&
        dom.div({className: "packet-rep"}, Rep({object: packet}))
    )
  },

  render: function() {
    let {expression} = this.props;
    let {input, packet} = expression;
    return dom.div({
        className: "rep-row"
      },
      dom.div({ className: "rep-input" }, input),
      dom.div({ className: "reps" }, this.renderRepInAllModes({
        object: packet.exception || packet.result
      })),
      this.renderPacket(packet)
    );
  }
});

module.exports = Result;
