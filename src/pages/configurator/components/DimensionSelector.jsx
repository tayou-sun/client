import React, { Component } from "react";
import { connect } from "react-redux";
import VirtualizedSelect from "react-virtualized-select";
import Select from "react-select";
import api from "../../../api/configurator";
import { getDimensionList } from "../store/dicts/reducer";

class DimensionSelector2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensionId: null,
      dimMembers: [],
      dimMemberId: null,
      isLoading: false
    };
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.handleDimMemberChange = this.handleDimMemberChange.bind(this);
    this.handleOKClick = this.handleOKClick.bind(this);
  }

  handleDimensionChange(dimensionId) {
    this.setState(
      {
        dimensionId,
        dimMembers: [],
        dimMemberId: null,
        isLoading: true
      },
      () => {
        if (!dimensionId) return;
        api.getDimMembers(dimensionId).then(data => {
          this.setState({ dimMembers: data, isLoading: false });
        });
      }
    );
  }

  handleDimMemberChange(dimMemberId) {
    this.setState({ dimMemberId });
  }

  handleOKClick() {
    this.props.onSubmit({
      dimension: {
        id: this.state.dimensionId,
        name: this.props.dimensionsById[this.state.dimensionId]
      },
      dimMember: this.state.dimMemberId
        ? this.state.dimMembers.find(m => m.id === this.state.dimMemberId)
        : null
    });
    this.props.onClose();
  }

  render() {
    return (
      <div>
        <div>
          <label>Измерение</label>
          <VirtualizedSelect
            options={this.props.dimensionList}
            simpleValue
            clearable
            name="dimensionId"
            value={this.state.dimensionId}
            onChange={this.handleDimensionChange}
            searchable
            valueKey="id"
            labelKey="name"
            placeholder="Выберите значение..."
          />
        </div>
        {this.state.dimensionId && (
          <div>
            <label>Значение</label>
            <Select
              options={this.state.dimMembers}
              value={this.state.dimMemberId}
              isLoading={this.state.isLoading}
              onChange={this.handleDimMemberChange}
              valueKey="id"
              labelKey="name"
              searchable
              clearable
              simpleValue
              placeholder="Выберите значение..."
            />
          </div>
        )}
        <button
          type="button"
          disabled={!this.state.dimensionId}
          className="btn modalForm-btn"
          onClick={this.handleOKClick}
        >
          OK
        </button>
        <button
          type="button"
          className="btn  modalForm-btn"
          onClick={this.props.onClose}
        >
          Отмена
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dimensionList: getDimensionList(state),
    dimensionsById: state.configurator.dicts.dimensions.byId
  };
};

export default connect(mapStateToProps)(DimensionSelector2);
