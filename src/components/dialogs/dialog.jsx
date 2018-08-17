import React, { Component } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
export class Dialog extends Component {
  constructor(props) {
    super(props);
    this.onPopupClick = this.onPopupClick.bind(this);
    this.state = {
      isVisible: false,
      isModal: false
    };
  }

  componentDidMount() {
    this.setState({
      isVisible: this.props.isVisible,
      isModal: this.props.isModal
    });
  }
  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;
    if (isVisible) {
      this.show();
    } else {
      this.hide();
    }
  }
  hide = () => {
    this.setState({ isVisible: false });
    document.body.classList.remove("no-scroll");
  };
  show = () => {
    this.setState({ isVisible: true });
    document.body.classList.add("no-scroll");
  };

  onOverlayClick = e => {
    const { isModal } = this.state;
    e.stopPropagation();
    if (isModal) return false;
    this.hide();
  };
  onPopupClick = e => {
    e.stopPropagation();
    return false;
  };
  onSuccess = e => {
    e.stopPropagation();
    this.hide();
  };
  onCancel = e => {
    e.stopPropagation();
    this.hide();
  };

  render() {
    const { isVisible } = this.state;
    let controls;
    if (type === undefined || type === DialogTypes.OK__DIALOG) {
      controls = (
        <span className="btn dialog__control" onClick={this.onSuccess}>
          ОК
        </span>
      );
    } else {
      controls = (
        <div>
          <span className="btn dialog__control" onClick={this.onSuccess}>
            ОК
          </span>
          <span className="btn dialog__control" onClick={this.onCancel}>
            Cancel
          </span>
        </div>
      );
    }
    //if (!isVisible) return null;
    const { children, isModal, type } = this.props;
    const cls = classNames({
      "dialog-overlay": true,
      modal: isModal
    });
    const dialogCls = classNames("dialog", this.props.className);
    return (
      <CSSTransition in={isVisible} timeout={300} classNames="dialog" unmountOnExit>
        {state => {
          return (
            <div>
              <div className="dialog-bg" onClick={this.onOverlayClick}>
                <div className={dialogCls} onClick={this.onPopupClick}>
                  <div className="dialog__header" />
                  <div className="dialog__content">{children}</div>
                  <div className="dialog__footer">
                    <div className="dialog__controls">{controls}</div>
                  </div>
                </div>
              </div>
              <div className={cls} />
            </div>
          );
        }}
      </CSSTransition>
    );
  }
}

export const DialogTypes = {
  OK__DIALOG: 1,
  OK_CANCEL__DIALOG: 2
};
