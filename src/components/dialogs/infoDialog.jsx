import React, { Component } from "react";
import { Dialog } from "cmp/dialogs/dialog";

class InfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  componentDidMount() {
    this.setState({
      isVisible: this.props.isVisible
    });
  }
  componentWillReceiveProps(nextProps) {}
  onClick = e => {
    e.stopPropagation();
  };
  render() {
    const { isVisible, isModal, className, children } = this.props;
    return (
      <Dialog className={className} isVisible={isVisible} isModal={isModal}>
        {children}
      </Dialog>
    );
  }
}

export default InfoDialog;
