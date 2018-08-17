import React from "react";
import PropTypes from "prop-types";
import Icon from "cmp/icon/icon";
import CustomExpandable from "cmp/expandable/customExpandable";
import Expandable from "cmp/expandable/expandable";
import { connect } from "react-redux";
import Checkbox from "../checkbox/checkbox";
import _ from "lodash";
import classNames from "classnames";
import FaBeer from "react-icons/lib/fa/beer";
import FaAutomobile from "react-icons/lib/fa/automobile";
import FaPlane from "react-icons/lib/fa/plane";
import FaTrain from "react-icons/lib/fa/train";
import FaShip from "react-icons/lib/fa/ship";

import Collapse, { Panel } from "rc-collapse";

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectAllClick = this.onSelectAllClick.bind(this);
    // this.state = {
    //   //   selected: new Set(),
    //   //   selectedCount: 0
    //   allSelected: false
    // };
  }

  // componentDidMount() {
  //   // setTimeout(() => {
  //   //   //     const newSet = new Set(this.props.selectedValues);
  //   //   this.setState({
  //   //     allSelected: this.areAllValuesSelected()
  //   //     //selected: newSet,
  //   //     //       selectedCount: newSet.size
  //   //   });
  //   // }, 0);
  // }
  componentWillReceiveProps(nextProps) {
    // const allSelected = this.areAllValuesSelected(nextProps);
    // const { selectionInProgress } = this.state;
    // if (!selectionInProgress) {
    //   this.setState({
    //     allSelected: allSelected,
    //     selectionInProgress: false
    //   });
    // }
  }
  areAllValuesSelected = props => {
    const { selectedValues, choices } = props;
    const choicesIds = _
      .chain(choices)
      .filter(x => x.isActive)
      .map(x => x.id)
      .value();
    return _.isEqual(choicesIds, selectedValues);
  };

  updateSelectionState = selectionData => {
    // const { selected } = this.state;
    const { isChecked, id } = selectionData;
    const { choices } = this.props;
    const targetChoice = _.find(choices, x => x.id === id);

    if (!targetChoice.isActive) return;

    // if (isChecked) {
    //   selected.add(id);
    // } else {
    //   selected.delete(id);
    // }

    if (this.props.onChange) {
      this.props.onChange(id, this.props.code, isChecked);
    }
  };

  onChange = newSelection => {
    this.updateSelectionState(newSelection);
  };
  getActiveChoices = () => {
    const { choices } = this.props;
    return _
      .chain(choices)
      .filter(x => x.isActive)
      .map(x => x.id)
      .value();
  };
  onSelectAllClick() {
    // const ids = _.map(this.props.choices, x => x.id);
    // const allSelected = _.all(ids, x => this.state.selected.has(x));
    // const { selected } = this.state;
    // if (allSelected) {
    //   selected.clear();
    // } else {
    //   _.each(ids, x => selected.add(x));
    // }
    // this.setState({
    //   selected: selected,
    //   selectedCount: selected.size
    // });

    if (this.props.onSelectAll) {
      //this.props.onSelectAll(this.props.code, Array.from(selected));
      const choices = this.getActiveChoices();
      this.props.onSelectAll(this.props.code, choices);
    }
  }
  onToggle = expanded => {
    if (this.props.onToggle) {
      this.props.onToggle(this.props.code, expanded);
    }
  };
  onDeselectAll = () => {
    if (this.props.onDeselectAll) {
      this.props.onDeselectAll(this.props.code);
    }
  };

  render() {
    const { selectedValues } = this.props;
    const selectedCount = selectedValues.length;
    const ids = _.map(this.props.choices, x => x.id);

    let choices = [];
    if (this.props.choices) {
      choices = this.props.choices.map(x => {
        const cls = classNames({
          filter__choice: true,
          inactive: !x.isActive
        });
        const checked = _.some(selectedValues, v => v === x.id);
        return (
          <div className={cls} key={x.id}>
            <Checkbox id={x.id} text={x.text} isActive={x.isActive} checked={checked} onChange={this.onChange} />
          </div>
        );
      });
    }

    const allSelected = this.areAllValuesSelected(this.props);

    const filterClasses = classNames({
      filter: true,
      selected: selectedValues.length > 0
    });
    return (
      <div className={filterClasses}>
        <div className="filter__toolbar" onClick={this.onDeselectAll} title="Отменить выбор">
          <span className="filter__toolbar-content">
            <span className="filter__selection-count">{selectedCount}</span>
            <span className="filter__clear-selection">
              <Icon name="cross" />
            </span>
          </span>
        </div>
        <div className="filter__choices">
          <Expandable expanded={this.props.expanded} name={this.props.name} onToggle={this.onToggle}>
            <div>
              <div className="filter__choices-actions" onClick={this.onSelectAllClick}>
                {allSelected ? "отменить выбор всех" : "выбрать всё"}
              </div>
              <div>{choices}</div>
            </div>
          </Expandable>

          {/* <CustomExpandable header={this.props.name} open={this.props.expanded} onToggle={this.onToggle}>
            <div>{choices}</div>
          </CustomExpandable> */}
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
