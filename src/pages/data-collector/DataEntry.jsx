import React, { Component } from "react";
// import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import configuratorAPI from "../../api/configurator";
//import VirtualizedSelect from "react-virtualized-select";
import VirtualizedSelect from "../configurator/components/ReactVirtualizedSelect";
import api from "../../api/dataCollector";
import EditableTablePart from "./EditableTablePart";
import ModalForm from "../configurator/components/ModalForm";

export default class DataEntry extends Component {
  constructor(props) {
    super(props);

    this.campaignId = this.props.match.params.campaignId;
    this.formId = this.props.match.params.formId;

    this.state = {
      batchId: null,
      date: moment(),
      parts: { byId: null, isLoading: true },
      organizations: { list: [], isLoading: false },
      organizationId: null,
      formInfo: {},
      rollbackFlag: {},
      completionConfirmation: false
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.refreshBatchId = this.refreshBatchId.bind(this);
    this.handleOrganizatioChange = this.handleOrganizatioChange.bind(this);
    this.onCompleteClick = this.onCompleteClick.bind(this);
    this.toggleCompletionConfirmation = this.toggleCompletionConfirmation.bind(
      this
    );
  }

  componentDidMount() {
    api
      .getFormInfo(this.formId)
      .then(response => {
        this.setState({ formInfo: response });
      })
      .then(() => configuratorAPI.getTableParts(this.formId))
      .then(parts => {
        this.setState({
          parts: {
            byId: parts,
            isLoading: false,
            organizations: { ...this.state.organizations, isLoading: true }
          }
        });
      })
      .then(() => api.getOrganizations())
      .then(orgs => {
        this.setState({ organizations: { list: orgs, isLoading: false } });
      });
  }

  handleDateChange(date) {
    this.setState({ date }, () => {
      this.refreshBatchId();
    });
  }

  handleOrganizatioChange(orgId) {
    this.setState({ organizationId: orgId }, () => {
      this.refreshBatchId();
    });
  }

  refreshBatchId() {
    if (!this.state.organizationId) {
      this.setState({ batchId: null });
      return;
    }
    api
      .getBatchId(
        this.campaignId,
        this.formId,
        this.state.organizationId,
        this.state.date.format("YYYY-MM-DD")
        //      this.state.date.toISOString()
      )
      .then(response => {
        if (response.error) throw new Error(response.error);
        this.setState({ batchId: response.batchId });
      })
      .catch(error => {
        alert(error.message);
      });
  }

  toggleCompletionConfirmation() {
    this.setState(prevState => {
      return { completionConfirmation: !prevState.completionConfirmation };
    });
  }

  onCompleteClick() {
    this.setState({ completionConfirmation: false });
    api.postBatchToFact(this.state.batchId).then(response => {
      if (response.error) {
        alert(response.error);
        return;
      }
      this.setState({ rollbackFlag: {} });
      alert("Передано в факт");
    });
  }

  render() {
    const {
      parts,
      batchId,
      organizations,
      organizationId,
      formInfo
    } = this.state;

    return (
      <div className="dataEntryPage">
        <h3>Ввод данных: {formInfo.name}</h3>
        <div>
          <label>Период</label>
          <DatePicker
            selected={this.state.date}
            onChange={this.handleDateChange}
            locale="ru-RU"
            showMonthDropdown
          />
        </div>
        <div style={{ maxWidth: "500px" }}>
          <label>Организация</label>
          <VirtualizedSelect
            options={organizations.list}
            simpleValue
            clearable
            isLoading={organizations.isLoading}
            value={organizationId}
            onChange={this.handleOrganizatioChange}
            searchable
            valueKey="id"
            labelKey="name"
            placeholder="Выберите организацию..."
            noResultsText="Нет данных"
          />
        </div>
        <div>Текущий Batch ID: {batchId || "Не установлен"}</div>
        {parts.isLoading ? (
          <div>Загрузка табличных частей</div>
        ) : _.keys(parts.byId).length > 0 ? (
          <div>
            {_.keys(parts.byId).map(id => (
              <div key={id}>
                <h5>{parts.byId[id].name}</h5>
                {batchId ? (
                  <EditableTablePart
                    formId={this.formId}
                    partId={id}
                    batchId={this.state.batchId}
                    rollbackFlag={this.state.rollbackFlag}
                  />
                ) : (
                  <div>Установите Batch ID</div>
                )}
              </div>
            ))}
            {batchId && (
              <button
                type="button"
                className="btn"
                onClick={this.toggleCompletionConfirmation}
              >
                Завершить
              </button>
            )}
          </div>
        ) : (
          <div>Табличные части не найдены</div>
        )}
        <ModalForm isShown={this.state.completionConfirmation}>
          <div>
            <div>Продолжить?</div>
            <div>Все несохраненные изменения будут утеряны!</div>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.onCompleteClick}
            >
              OK
            </button>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.toggleCompletionConfirmation}
            >
              Отмена
            </button>
          </div>
        </ModalForm>
      </div>
    );
  }
}

// const mapStateToProps = (state, props) => {
//   const formId = props.match.params.formId;
//   return {
//     form: state.dataCollector.forms[formId] || {}
//   };
// };

// export default connect(mapStateToProps)(DataEntry);
