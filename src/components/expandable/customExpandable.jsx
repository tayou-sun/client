import React, { Component } from "react";
import Collapsible from "react-collapsible";

class CustomExpandable extends Component {
  onOpen = () => {};
  onClose = () => {};
  onOpening = () => {
    this.onToggle(true);
  };
  onClosing = () => {
    this.onToggle(false);
  };
  onToggle = expanded => {
    if (this.props.onToggle) {
      this.props.onToggle(expanded);
    }
  };

  render() {
    const { header, open } = this.props;
    const { children } = this.props;
    const easing = "cubic-bezier(.075, .82, .165, 1)";
    const transitionTime = 220;
    const triggerTagName = "div";

    return (
      <div>
        <Collapsible
          open={open}
          easing={easing}
          transitionTime={transitionTime}
          trigger={header}
          triggerTagName={triggerTagName}
          onOpen={this.onOpen}
          onClose={this.onClose}
          onOpening={this.onOpening}
          onClosing={this.onClosing}>
          {children}
        </Collapsible>
      </div>
    );
  }
}

export default CustomExpandable;
