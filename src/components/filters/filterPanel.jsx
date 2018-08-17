import React from "react";
import { connect } from "react-redux";
import Icon from "cmp/icon/icon";
import { hideSidebar, showSidebar } from "cmp/sidebar/sidebarActions";
import Filter from "./filter";
import TransportFilter from "./ttFilter";
import { getFilters, changeFilterSelection, clearUnusedSelection, selectAllValuesByFilter, unselectAllValuesByFilter } from "pages/home/homeActions";
import _ from "lodash";
import classNames from "classnames";
import CustomScrollbar from "cmp/scrollbars/customScrollbar";

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onCloseClick(e) {
    e.preventDefault();
    this.props.hideSidebar();
  }

  refreshFilters() {
    let data = [];
    const { selectedFilterValues } = this.props;
    for (let code in selectedFilterValues) {
      data.push({
        filterCode: code,
        selectedValues: selectedFilterValues[code]
      });
    }
    this.props.getFilters({ values: data });
  }

  onFilterSelectionChanged = (id, filterCode, isChecked) => {
    const { changeFilterSelection } = this.props;
    changeFilterSelection(filterCode, id, isChecked);
    setTimeout(() => {
      this.refreshFilters();
    }, 0);
  };
  onSelectAll = (filterCode, selectedData) => {
    const { selectAll, unselectAll } = this.props;
    const { selectedFilterValues } = this.props;
    const { filters } = this.props;

    const selectedValues = selectedFilterValues[filterCode];
    const targetFilter = _.filter(filters, x => x.code === filterCode);
    const filterChoices = _.map(targetFilter.allowedValues, x => x.id);

    const needToSelect = _.isEmpty(selectedValues) || _.isEqual(filterChoices, selectedValues);

    if (needToSelect) {
      selectAll(filterCode, selectedData);
    } else {
      unselectAll(filterCode);
    }

    setTimeout(() => {
      this.refreshFilters();
    }, 0);
  };

  onDeselectAll = filterCode => {
    const { unselectAll } = this.props;
    unselectAll(filterCode);
    setTimeout(() => {
      this.refreshFilters();
    }, 0);
  };

  onToggle = (id, expanded) => {
    if (this.props.onFilterToggle) {
      this.props.onFilterToggle(id, expanded);
    }
  };

  render() {
    let filters = [];
    const { selectedFilterValues, filtersExpandState } = this.props;
    console.log("filter expanded state updated !!!");
    var fpClassName = classNames({
      "filter-panel": true,
      active: this.props.isActive
    });
    if (this.props.filters) {
      filters = _
        .sortBy(this.props.filters, x => x.order)
        .map(x => (
          <Filter
            key={x.code}
            id={x.id}
            code={x.code}
            name={x.name}
            expanded={filtersExpandState[x.code]}
            choices={x.allowedValues}
            onToggle={this.onToggle}
            onChange={this.onFilterSelectionChanged}
            onSelectAll={this.onSelectAll}
            onDeselectAll={this.onDeselectAll}
            selectedValues={selectedFilterValues[x.code] || []}
          />
        ));
    }
    return (
      <div className={fpClassName}>
        <CustomScrollbar autoHide>
          <div className="filter-panel__content">
            <div className="filter-panel__toolbar">
              <div className="filter-panel__toolbar-item clickable" onClick={this.onCloseClick} />
            </div>
            {filters}
          </div>
        </CustomScrollbar>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    filters: state.main.filters,
    selectedFilterValues: state.main.selectedFilterValues,
    filtersExpandState: state.main.filtersExpandState,
    isActive: state.sidebar.isActive
  };
};

let mapDispatchToProps = dispatch => {
  return {
    getFilters: request => dispatch(getFilters(request)),
    hideSidebar: () => dispatch(hideSidebar()),
    changeFilterSelection: (filterCode, selectedValue, isChecked) => dispatch(changeFilterSelection(filterCode, selectedValue, isChecked)),
    selectAll: (filterCode, selectedData) => dispatch(selectAllValuesByFilter(filterCode, selectedData)),
    unselectAll: filterCode => dispatch(unselectAllValuesByFilter(filterCode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPanel);
