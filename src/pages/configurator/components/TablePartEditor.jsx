import React, { Component } from "react";
import { connect } from "react-redux";
import VirtualizedSelect from "./ReactVirtualizedSelect";
//import VirtualizedSelect from "react-virtualized-select";
import { getTablePartTypeList, getMemberList } from "../store/dicts/reducer";
import { saveTablePart } from "../store/tableParts/actions";
import { getCurrentFormId } from "../store/formCtor/formId/reducer";

class TablePartEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: this.props.fields,
      error: null,
      isDirty: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleMemberChange = this.handleMemberChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
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

  handleMemberChange(memberId) {
    this.setState({
      fields: {
        ...this.state.fields,
        memberId
      },
      isDirty: true,
      error: ""
    });
  }

  handleSaveClick() {
    this.setState({ isDirty: false });
    this.props.dispatch(
      saveTablePart(
        this.state.fields,
        error => this.setState({ error }),
        () => {
          this.props.onClose();
        }
      )
    );
  }

  render() {
    const { tablePartTypes, members } = this.props;
    const error = this.state.error;
    return (
      <div>
        {error && (
          <div style={{ fontWeight: "bold", color: "red" }}>
            Ошибка: {error}
          </div>
        )}
        <form>
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
            <label>Порядковый номер</label>
            <input
              className="form-control"
              value={this.state.fields.sortOrder}
              name="sortOrder"
              type="number"
              min="1"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>
              Тип
              <select
                className="form-control"
                value={this.state.fields.typeId}
                name="typeId"
                onChange={this.handleInputChange}
              >
                <option value="" />
                {tablePartTypes.map(type => (
                  <option value={type.id} key={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
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
          <div className="form-group">
            <label>Множитель для сортировки строк</label>
            <input
              className="form-control"
              value={this.state.fields.rowSortMultiplier}
              name="rowSortMultiplier"
              type="number"
              min="1"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Множитель для сортировки столбцов</label>
            <input
              className="form-control"
              value={this.state.fields.colSortMultiplier}
              name="colSortMultiplier"
              type="number"
              min="1"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>
              Разрядность номера строки
              <input
                className="form-control"
                value={this.state.fields.rowNumCapacity}
                name="rowNumCapacity"
                type="number"
                min="0"
                onChange={this.handleInputChange}
              />
            </label>
          </div>{" "}
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
          onClick={this.props.onClose}
        >
          Отмена
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { partId } = props;
  const part = partId
    ? state.configurator.formCtor.tableParts.byId[partId]
    : {};
  const fields = {
    id: partId,
    name: part.name || "",
    typeId: part.typeId || 1,
    memberId: part.memberId || null,
    rowSortMultiplier: part.rowSortMultiplier || 1,
    colSortMultiplier: part.colSortMultiplier || 1,
    rowNumCapacity: part.rowNumCapacity || 0,
    sortOrder: part.sortOrder || ""
  };
  return {
    formId: getCurrentFormId(state),
    fields,
    members: getMemberList(state),
    tablePartTypes: getTablePartTypeList(state)
  };
};

export default connect(mapStateToProps)(TablePartEditor);
