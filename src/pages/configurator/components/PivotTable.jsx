import React, { Component } from "react";
import api from "../../../api/configurator";
import PivotTableUI from "../components/pivotTable/PivotTableUI";
import "../components/pivotTable/pivottable.css";

export default class PivotTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      pivot: {
        aggregatorName: "Sum",
      },
      error: null,
      changes: [],
      isLoading: false
    };
    this.accumulateChanges = this.accumulateChanges.bind(this);
  }

  componentDidMount() {
    const { formId, part } = this.props;

    if (this.state.data === null) {
      this.setState({ isLoading: true });
      api
        .getPivotTableData(formId, part.id)
        .then(response => {
          if (response.error) throw new Error(response.error);
          this.meta = {
            valueName: response.values.length > 0 ? response.values[0] : "VAL", // we have only one value field
            keys: response.keys || []
          };
          this.setState({
            data: response.data,
            pivot: {
              ...this.state.pivot,
              rows: response.rows,
              cols: response.columns,
              vals: response.values,
              hiddenFromDragDrop: [this.meta.valueName]
            },
            isLoading: false
          });
        })
        .catch(error => {
          this.setState({ error: error.message, isLoading: false });
        });
    }
  }

  accumulateChanges(i, value) {
    const row = { ...this.state.data[i], VAL: value };
    let result = { value };
    for (let key in this.meta.keys) {
      result[key] = row[this.meta.keys[key]];
    }
    const { data, changes } = this.state;
    this.setState({
      data: [...data.slice(0, i), row, ...data.slice(i + 1)],
      changes: changes.concat(result)
    });
  }

  render() {
    const { formId, part } = this.props;
    const partId = part.id;
    return (
      <div>
        <h3>{part.name}</h3>
        {this.state.error ? (
          <div>Ошибка загрузки данных:{this.state.error}</div>
        ) : this.state.isLoading ? (
          <div>Загрузка данных...</div>
        ) : this.state.data ? (
          <PivotTableUI
            data={this.state.data}
            onChange={s => this.setState({ pivot: s })}
            // onDataChange={(k, v) => {
            //   this.accumulateChanges(k, v);
            // }}
            {...this.state.pivot}
          />
        ) : (
          <div>Нет данных</div>
        )}
      </div>
    );
  }
}
