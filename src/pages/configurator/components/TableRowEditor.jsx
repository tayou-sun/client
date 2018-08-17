import React, { Component } from "react";
import { connect } from "react-redux";
import VirtualizedSelect from "./ReactVirtualizedSelect";
//import VirtualizedSelect from "react-virtualized-select";
//import Select from "react-select";
import FaClose from "react-icons/lib/fa/close";
import ModalForm from "./ModalForm";
import DimensionSelector from "./DimensionSelector";
import { getMemberList, getUnitList } from "../store/dicts/reducer";
import { saveRow } from "../store/tableRows/actions";

class TableRowEditor extends Component {
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
    this.handleVirtSelectChange = this.handleVirtSelectChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.toggleDimensionSelector = this.toggleDimensionSelector.bind(this);
  }

  handleSaveClick() {
    this.setState({ isDirty: false });
    this.props.dispatch(
      saveRow(
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

  handleVirtSelectChange(field, value) {
    this.setState({
      fields: { ...this.state.fields, [field]: value },
      isDirty: true,
      error: ""
    });
  }

  render() {
    const { units, members, rows } = this.props;
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
            <label>Номер строки</label>
            <input
              className="form-control"
              value={this.state.fields.rowNumber}
              name="rowNumber"
              type="text"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Текстовая строка</label>
            <input
              className="form-control"
              checked={this.state.fields.isText}
              name="isText"
              type="checkbox"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Единица измерения</label>
            <VirtualizedSelect
              options={units}
              simpleValue
              clearable
              name="unitId"
              value={this.state.fields.unitId}
              onChange={value => {
                this.handleVirtSelectChange("unitId", value);
              }}
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
              onChange={value => {
                this.handleVirtSelectChange("memberId", value);
              }}
              searchable
              labelKey="name"
              valueKey="id"
              placeholder="Выберите значение..."
            />
            {/* <Select
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
              /> */}
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
          <div className="form-group">
            <label>Суммарная строка</label>
            <input
              className="form-control"
              checked={this.state.fields.isSumOfChildren}
              name="isSumOfChildren"
              type="checkbox"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Объединяет все столбцы</label>
            <input
              className="form-control"
              checked={this.state.fields.isColumnsUnion}
              name="isColumnsUnion"
              type="checkbox"
              onChange={this.handleInputChange}
            />
          </div>
          {rows &&
            rows.length > 0 && (
              <div className="form-group">
                <label>Родительская строка</label>
                <select
                  className="form-control"
                  value={this.state.fields.parentRowId}
                  name="parentRowId"
                  onChange={this.handleInputChange}
                >
                  <option value="" />
                  {rows.map(row => {
                    if (this.props.rowId !== 0 && this.props.rowId === row.id)
                      return;
                    return (
                      <option value={row.id} key={row.id}>
                        {row.rowNumber + " - " + row.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
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
  const { rowId } = ownProps;
  const row = rowId ? state.configurator.formCtor.tableRows.byId[rowId] : {};
  const fields = {
    id: rowId,
    name: row.name || "",
    description: row.description || "",
    rowNumber: row.rowNumber || "",
    unitId: row.unitId,
    parentrowId: row.parentrowId || "",
    isText: row.isText || false,
    isSumOfChildren: row.isSumOfChildren || false,
    isColumnsUnion: row.isColumnsUnion || false,
    memberId: row.memberId,
    dimensionId: row.dimensionId,
    dimMemberId: row.dimMemberId
  };
  return {
    fields,
    members: getMemberList(state),
    units: getUnitList(state),
    dimension: row.dimensionId
      ? state.configurator.dicts.dimensions.byId[row.dimensionId]
      : ""
  };
};

export default connect(mapStateToProps)(TableRowEditor);
