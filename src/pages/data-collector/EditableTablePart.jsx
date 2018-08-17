import React, { Component } from "react";
import _ from "lodash";
import api from "../../api/dataCollector";
import PivotTableUI from "../configurator/components/pivotTable/PivotTableUI";
import "../configurator/components/pivotTable/pivottable.css";
import TableRenderers from  "../configurator/components/pivotTable/TableRenderers";
import Plot from 'react-plotly.js';
import createPlotlyRenderers from '../configurator/components/pivotTable/PlotlyRenderers';

const PlotlyRenderers = createPlotlyRenderers(Plot);

export default class EditableTablePart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pivot: {
        data: null,
        aggregatorName: "Editable"
      },
      error: null,
      changes: null,
      isLoading: false
    };

    this.oldData = null;

    this.onDataChange = this.onDataChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.rollbackChanges = this.rollbackChanges.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.batchId !== prevProps.batchId) {
      this.refreshData();
      return;
    }
    if (this.props.rollbackFlag !== prevProps.rollbackFlag) {
      this.rollbackChanges();
      return;
    }
  }

  refreshData() {
    const { formId, partId, batchId } = this.props;

    this.setState({ isLoading: true }, () => {
      api
        .getTablePartForEditing(formId, partId, batchId)
        .then(response => {
          if (response.error) throw new Error(response.error);
          this.meta = {
            valueName: response.values.length > 0 ? response.values[0] : "VAL", // we have only one value field
            keys: response.keys || []
          };
          this.setState({
            pivot: {
              ...this.state.pivot,
              data: response.data,
              rows: response.rows,
              cols: response.columns,
              vals: response.values,
              hiddenFromDragDrop: [this.meta.valueName]
            },
            isLoading: false
          });
          this.oldData = response.data;
        })
        .catch(error => {
          this.setState({ error: error.message, isLoading: false });
        });
    });
  }

  onDataChange(i, value) {
    const row = { ...this.state.pivot.data[i], VAL: value };

    let change = { VAL: value };
    let changeKey = "";
    const keyDelimeter = String.fromCharCode(0);
    for (let key in this.meta.keys) {
      const keyValue = row[this.meta.keys[key]];
      changeKey = changeKey + keyValue + keyDelimeter;
      change[key] = keyValue;
    }

    const data = this.state.pivot.data;
    this.setState({
      pivot: {
        ...this.state.pivot,
        data: [...data.slice(0, i), row, ...data.slice(i + 1)]
      },
      changes: { ...this.state.changes, [changeKey]: { ...change } }
    });
  }

  rollbackChanges() {
    if (this.state.changes === null) return;
    this.setState({
      pivot: { ...this.state.pivot, data: this.oldData },
      changes: null
    });
  }

  onSaveClick() {
    const batch = {
      batchId: this.props.batchId,
      partId: this.props.partId,
      data: _.keys(this.state.changes).map(key => this.state.changes[key])
    };
    api.postDataToSave(batch).then(response => {
      if (response.error) {
        alert(response.error);
        return;
      }
      this.oldData = this.state.pivot.data;
      this.setState({ changes: null });
    });
  }

  render() {
    return (
      <div>
        {this.state.error ? (
          <div>Ошибка загрузки данных:{this.state.error}</div>
        ) : this.state.isLoading ? (
          <div>Загрузка данных...</div>
        ) : this.state.pivot.data ? (
          <div>
            <PivotTableUI
              onChange={s => this.setState({ pivot: s })}
              onDataChange={(k, v) => {
                this.onDataChange(k, v);
              }}
              {...this.state.pivot}
              unusedOrientationCutoff={Infinity}
              renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            />
            <button
              type="button"
              className="btn"
              disabled={!this.state.changes}
              onClick={this.onSaveClick}
            >
              Сохранить
            </button>
          </div>
        ) : (
          <div>Нет данных</div>
        )}
      </div>
    );
  }
}
