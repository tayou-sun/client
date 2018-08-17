import React, { Component } from "react";
import Icon from "cmp/icon/icon";
import classnames from "classnames";

class Expandable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
    this.setState({
      expanded: this.props.expanded,
      height: this.refs.inner.clientHeight
    });
  }
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.setState({
        height: this.refs.inner.clientHeight
      });
    }, 0);
  }
  onToggle = e => {
    e.preventDefault();

    this.setState({
      expanded: !this.state.expanded,
      height: this.refs.inner.clientHeight
    });
    if (this.props.onToggle) {
      this.props.onToggle(!this.state.expanded);
    }
  };

  render() {
    const { title, children } = this.props;
    const currentHeight = this.state.expanded ? this.state.height : 0;

    const expandedClass = classnames({
      expandable: true,
      expanded: this.state.expanded || this.props.expanded
    });

    return (
      <div className={expandedClass}>
        <div className="expandable__header" onClick={this.onToggle}>
          <div className="expandable__title">
            <span className="expandable__title-text">{this.props.name}</span>
          </div>
          <div className="expandable__action">
            <Icon name="angle-up" size={15} />
          </div>
        </div>

        <div className="expandable__collapse" style={{ height: currentHeight + "px" }}>
          <div className="expandable__content" ref="inner">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Expandable;
