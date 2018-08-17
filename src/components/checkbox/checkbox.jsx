import React, { Component } from "react";
import classNames from "classnames";

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      checked: false,
      isActive: false
    };
  }

  componentDidMount() {
    this.setState({
      checked: this.props.checked,
      isActive: this.props.isActive
    });
  }

  componentWillReceiveProps(nextProps) {
    const { checked, isActive } = nextProps;
    this.setState({
      checked: checked,
      isActive: isActive
    });
  }
  onChange(e) {
    const newState = !this.state.checked;
    if (this.props.onChange) {
      this.props.onChange({
        isChecked: newState,
        id: this.props.id
      });
      setTimeout(() => {
        this.setState({
          checked: newState
        });
      }, 0);
    }
  }
  onClick(e) {
    const { isActive } = this.state;
    if (!isActive) return;
    this.onChange(e);
  }

  render() {
    const { showCheckbox } = this.props;
    let checkboxClassName = classNames({
      checkbox: true,
      checked: this.state.checked || this.props.checked
    });

    return (
      <div onClick={this.onClick} className={checkboxClassName}>
        {showCheckbox && <input type="checkbox" checked={this.state.checked} />}
        <div className="checkbox__additional-content">
          <div>{this.props.children}</div>
        </div>
        <span>{this.props.text}</span>
      </div>
    );
  }
}

export default Checkbox;
