import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

class CustomScrollbar extends Component {
  render() {
    const { props } = this;
    return (
      <Scrollbars
        {...props}
        className="container"
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
        renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
        renderView={props => <div {...props} className="view" />}>
        {this.props.children}
      </Scrollbars>
    );
  }
}
export default CustomScrollbar;
