import React from "react";

export default class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      value: props.data.value || 0
    };

    this.textInputRef = React.createRef();

    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onEditingEnd = this.onEditingEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data != prevProps.data)
      this.setState({ value: this.props.data.value });
    if (!this.state.edit || !this.textInputRef.current) return;
    this.textInputRef.current.focus();
  }

  onDoubleClick() {
    this.setState({ edit: true });
  }

  onEditingEnd() {
    this.setState({ edit: false });
    if (this.state.value !== this.props.data.value) {
      if (!isNaN(parseFloat(this.state.value)))
        this.props.onSubmit(this.props.data.key, this.state.value);
      else
        this.setState({ value: this.props.data.value });
    }
  }

  onHandleChange(e) {
    let val = e.target.value;
    this.setState({ value: val });
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      // ENTER - approve change
      this.onEditingEnd();
    } else if (e.keyCode === 27) {
      // ESC - cancel change
      this.setState({ edit: false, value: this.props.data.value });
    }
  }

  render() {
    if (this.state.edit)
      return (
        <td>
          <input
            ref={this.textInputRef}
            type="number"
            value={this.state.value}
            onKeyDown={this.onKeyDown}
            onBlur={this.onEditingEnd}
            onChange={this.onHandleChange}
          />
        </td>
      );
    return (
      <td
        onDoubleClick={this.onDoubleClick}
        style={{ backgroundColor: "#f0f2ff" }}
      >
        {this.state.value}
      </td>
    );
  }
}
