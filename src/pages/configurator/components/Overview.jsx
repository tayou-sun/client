import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import * as formCtorActions from "../store/formCtor/actions";
import * as checkerActions from "../store/formCtor/checker/actions";
import PivotTable from "./PivotTable";
import { getCurrentFormId } from "../store/formCtor/formId/reducer";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    if (this.props.checker.needToRun) this.props.checkForm();
  }

  messageTypeToString(msgType) {
    switch (msgType) {
      case 1:
        return "Предупреждение";
      case 2:
        return "Ошибка";
      default:
        return "Неизвестно";
    }
  }

  renderContent() {
    const { needToRun, completed, messages } = this.props.checker;
    if (needToRun || !completed) return null;
    const headers = [
      {
        Header: "",
        accessor: "lineNumber",
        maxWidth: 50,
        style: { textAlign: "right", paddingRight: "10px" }
      },
      {
        Header: "Тип",
        accessor: "messageType",
        maxWidth: 120,
        Cell: row => <div>{this.messageTypeToString(row.value)}</div>
      },
      { Header: "Сообщение", accessor: "message" }
    ];
    return (
      <div>
        {messages.length > 0 && (
          <ReactTable
            data={messages}
            manual
            columns={headers}
            loadingText="Загрузка данных..."
            minRows={4}
            noDataText="Нет данных"
            showPagination={false}
            sortable={false}
            getTrProps={(state, rowInfo, column) => {
              return {
                style: {
                  backgroundColor:
                    rowInfo.row.messageType === 1 ? "#ffffb7" : "#ffa3a3"
                }
              };
            }}
          />
        )}
        {this.props.partIds.map(id => (
          <PivotTable formId={this.props.formId} part={this.props.parts[id]} key={id} />
        ))}
      </div>
    );
  }

  render() {
    const { goPrev, submit } = this.props;
    return (
      <div>
        <h3>Итоговая информация</h3>
        {this.renderContent()}
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={goPrev}
        >
          Назад
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={submit}
        >
          Готово
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    checker: state.configurator.formCtor.checker,
    formId: getCurrentFormId(state),
    partIds: state.configurator.formCtor.tableParts.allIds,
    parts: state.configurator.formCtor.tableParts.byId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goPrev: () => {
      dispatch(formCtorActions.formCtorSetStep(2));
    },
    submit: () => dispatch(formCtorActions.formCtorExit()),
    checkForm: () => dispatch(checkerActions.checkForm())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
