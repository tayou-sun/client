import React from "react";
import { connect } from "react-redux";
import { hideSidebar, showSidebar } from "./sidebarActions";
import classNames from "classnames";
import Icon from "cmp/icon/icon";
import FaFilter from "react-icons/lib/fa/filter";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.toggleSidebar();
  }

  toggleSidebar() {
    if (this.props.isFilterPanelActive) {
      this.props.hideSidebar();
    } else {
      this.props.showSidebar();
    }
  }

  render() {
    var sidebarClass = classNames({
      sidebar: true
      //borderless: this.props.isFilterPanelActive
    });
    return (
      <div className={sidebarClass}>
        <div className="sidebar__item button" onClick={this.onClick}>
          <FaFilter className="icon" size={20} />
        </div>
        {this.props.children}
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    isFilterPanelActive: state.sidebar.isActive
  };
};

let mapDispatchToProps = dispatch => {
  return {
    hideSidebar: (index, tags) => dispatch(hideSidebar(index, tags)),
    showSidebar: (index, tags) => dispatch(showSidebar(index, tags))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
