import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ModalForm extends Component {
  render() {
    if (!this.props.isShown) return null;
    return (
      <div
        className="modalForm-overlay"
        onClick={this.props.onOverlayClick ? this.props.onOverlayClick : null}
        style={{ zIndex: this.props.zIndex || 100 }}
      >
        <div className="modalForm-content" onClick={e => { e.stopPropagation(); }}>
          {this.props.header && <div className="modalForm-header">{this.props.header}</div>}
          <div className="modalForm-body">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

ModalForm.propTypes = {
  isShown: PropTypes.bool.isRequired,
  zIndex: PropTypes.number,
  header: PropTypes.string,
  onOverlayClick: PropTypes.func
};
