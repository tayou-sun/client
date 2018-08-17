import React, { Component } from "react";

class MapControl extends Component {
  onClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };
  render() {
    return (
      <div className="map-control" onClick={this.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default MapControl;
