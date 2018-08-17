import React, { Component } from "react";
import { connect } from "react-redux";
import VirtualizedSelect from "./ReactVirtualizedSelect";
import FaClose from "react-icons/lib/fa/close";
import ModalForm from "./ModalForm";
import DimensionSelector from "./DimensionSelector";
import {
  getValueTypes,
  getMemberList,
  getUnitList
} from "../store/dicts/reducer";
import { saveColumn } from "../store/tableColumns/actions";

class TableColumnEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: this.props.fields,
      showDimensionSelector: false,
      dimension: this.props.dimension,
      error: null,
      isDirty: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleMemberChange = this.handleMemberChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.toggleDimensionSelector = this.toggleDimensionSelector.bind(this);
  }

  handleSaveClick() {
    this.setState({ isDirty: false });
    this.props.dispatch(
      saveColumn(
        this.props.partId,
        this.state.fields,
        error => {
          this.setState({ error });
        },
        () => {
          this.props.onCancel();
        }
      )
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      fields: { ...this.state.fields, [target.name]: value },
      isDirty: true,
      error: ""
    });
  }

  toggleDimensionSelector() {
    this.setState(prevState => {
      return { showDimensionSelector: !prevState.showDimensionSelector };
    });
  }

  handleDimensionChange(data) {
    if (!data || !data.dimension)
      this.setState({
        fields: {
          ...this.state.fields,
          dimensionId: null,
          dimMemberId: null
        },
        dimension: null,
        isDirty: true
      });
    else
      this.setState({
        fields: {
          ...this.state.fields,
          dimensionId: data.dimension.id,
          dimMemberId: data.dimMember ? data.dimMember.id : null
        },
        dimension:
          data.dimension.name +
          (data.dimMember ? "->" + data.dimMember.name : ""),
        isDirty: true
      });
  }

  handleMemberChange(memberId) {
    this.setState({
      fields: {
        ...this.state.fields,
        memberId
      },
      isDirty: true
    });
  }

  handleUnitChange(unitId) {
    this.setState({
      fields: {
        ...this.state.fields,
        unitId
      },
      isDirty: true
    });
  }

  render() {
    const { valueTypes, units, members, columns } = this.props;
    const error = this.state.error;
    return (
      <div>
        <form>
          {error && (
            <div style={{ fontWeight: "bold", color: "red" }}>
              Ошибка: {error}
            </div>
          )}
          <div className="form-group">
            <label>Наименование</label>
            <input
              className="form-control"
              value={this.state.fields.name}
              name="name"
              type="text"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <input
              className="form-control"
              value={this.state.fields.description}
              name="description"
              type="text"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Номер столбца</label>
            <input
              className="form-control"
              value={this.state.fields.columnNumber}
              name="columnNumber"
              type="text"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Тип значений</label>
            <select
              className="form-control"
              value={this.state.fields.valueTypeId}
              name="valueTypeId"
              onChange={this.handleInputChange}
            >
              <option value="" />
              {valueTypes.map(valueType => (
                <option value={valueType.id} key={valueType.id}>
                  {valueType.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Единица измерения</label>
            <VirtualizedSelect
              options={units}
              simpleValue
              clearable
              name="unitId"
              value={this.state.fields.unitId}
              onChange={this.handleUnitChange}
              searchable
              valueKey="id"
              labelKey="name"
              placeholder="Выберите значение..."
            />
          </div>
          <div>
            <label>Показатель</label>
            <VirtualizedSelect
              options={members}
              simpleValue
              clearable
              name="memberId"
              value={this.state.fields.memberId}
              onChange={this.handleMemberChange}
              searchable
              labelKey="name"
              valueKey="id"
              placeholder="Выберите значение..."
            />
          </div>
          <div>
            <label>Измерение/Разрез</label>
            <div>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={this.toggleDimensionSelector}
              >
                {this.state.dimension || "Выбрать..."}
              </span>
              {this.state.dimension && (
                <FaClose
                  onClick={() => {
                    this.handleDimensionChange();
                  }}
                  style={{
                    marginLeft: "10px",
                    color: "blue",
                    cursor: "pointer"
                  }}
                />
              )}
            </div>
          </div>
          {columns &&
            columns.length > 0 && (
              <div className="form-group">
                <label>Родительский столбец</label>
                <select
                  className="form-control"
                  value={this.state.fields.parentColumnId}
                  name="parentColumnId"
                  onChange={this.handleInputChange}
                >
                  <option value="" />
                  {columns.map(column => {
                    if (
                      this.props.columnId !== 0 &&
                      this.props.columnId === column.id
                    )
                      return;
                    return (
                      <option value={column.id} key={column.id}>
                        {column.sortOrder + " - " + column.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          <div className="form-group">
            <label>Суммарный столбец</label>
            <input
              className="form-control"
              checked={this.state.fields.isSumOfChildren}
              name="isSumOfChildren"
              type="checkbox"
              onChange={this.handleInputChange}
            />
          </div>
        </form>
        <button
          type="button"
          className="btn modalForm-btn"
          disabled={!this.state.isDirty}
          onClick={this.handleSaveClick}
        >
          Сохранить
        </button>
        <button
          type="button"
          className="btn modalForm-btn"
          onClick={this.props.onCancel}
        >
          Отмена
        </button>
        <ModalForm
          zIndex={110}
          isShown={this.state.showDimensionSelector}
          header="Измерение и разрез"
        >
          <DimensionSelector
            onSubmit={data => {
              this.handleDimensionChange(data);
            }}
            onClose={this.toggleDimensionSelector}
          />
        </ModalForm>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { columnId } = ownProps;
  const column = columnId
    ? state.configurator.formCtor.tableColumns.byId[columnId]
    : {};
  const fields = {
    id: columnId,
    name: column.name || "",
    description: column.description || "",
    valueTypeId: column.valueTypeId || "",
    columnNumber: column.columnNumber || "",
    parentColumnId: column.parentColumnId || "",
    unitId: column.unitId,
    memberId: column.memberId,
    dimensionId: column.dimensionId,
    dimMemberId: column.dimMemberId,
    isSumOfChildren: column.isSumOfChildren || false
  };
  return {
    fields,
    members: getMemberList(state),
    units: getUnitList(state),
    dimension: column.dimensionId
      ? state.configurator.dicts.dimensions.byId[column.dimensionId]
      : "",
    valueTypes: getValueTypes(state)
  };
};

export default connect(mapStateToProps)(TableColumnEditor);
