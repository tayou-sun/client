import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import classNames from "classnames";
import IconCheck from "react-icons/lib/md/check";
import IconEdit from "react-icons/lib/fa/edit";
import IconDelete from "react-icons/lib/fa/close";
import * as formCtorActions from "../store/formCtor/actions";
import { setMessage } from "../store/main/actions";
import { getRowListByPart } from "../store/tableRows/reducer";
import { loadRows, deleteRow } from "../store/tableRows/actions";
import ModalForm from "./ModalForm";
import TableRowEditor from "./TableRowEditor";

class TableRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: null,
      rowIdToDelete: null
    };
    this.toggleEditor = this.toggleEditor.bind(this);
    this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
    this.onRowDeletion = this.onRowDeletion.bind(this);
  }

  componentDidMount() {
    const { needToLoad, loadRows } = this.props;
    if (needToLoad) loadRows();
  }

  toggleEditor(rowId) {
    this.setState({ rowId });
  }

  toggleDeleteConfirmation(rowIdToDelete) {
    this.setState({ rowIdToDelete });
  }

  onRowDeletion() {
    this.props.deleteRow(
      this.state.rowIdToDelete,
      error => {
        this.toggleDeleteConfirmation();
        this.props.showErrorMessage(error);
      },
      () => {
        this.toggleDeleteConfirmation();
      }
    );
  }

  render() {
    const { part, step, goStep, rows } = this.props;
    const headers = [
      {
        Header: "",
        accessor: "id",
        maxWidth: 40,
        style: { textAlign: "center", cursor: "pointer" },
        Cell: row => (
          <div
            onClick={() => {
              this.toggleEditor(row.value);
            }}
          >
            <IconEdit style={{ width: "20px", height: "20px" }} />
          </div>
        )
      },
      {
        Header: "Номер",
        accessor: "rowNumber",
        maxWidth: 80,
        style: { textAlign: "right", paddingRight: "10px" }
      },
      { Header: "Наименование", accessor: "name", minWidth: 300 },
      { Header: "Ед.изм.", accessor: "unit" },
      { Header: "Показатель", accessor: "member" },
      { Header: "Измерение", accessor: "dimension" },
      { Header: "Номер родит. строки", accessor: "parentRow" },
      {
        Header: "Текстовая",
        accessor: "isText",
        Cell: row =>
          row.value ? (
            <div style={{ textAlign: "center" }}>
              <IconCheck className="icon-check" />
            </div>
          ) : null
      },
      {
        Header: "Суммарная",
        accessor: "isSumOfChildren",
        Cell: row =>
          row.value ? (
            <div style={{ textAlign: "center" }}>
              <IconCheck className="icon-check" />
            </div>
          ) : null
      },
      {
        Header: "Объединяет столбцы",
        accessor: "isColumnsUnion",
        Cell: row =>
          row.value ? (
            <div style={{ textAlign: "center" }}>
              <IconCheck className="icon-check" />
            </div>
          ) : null
      },
      { Header: "Описание", accessor: "description" },
      {
        Header: "Удалить",
        accessor: "id",
        maxWidth: 70,
        style: { textAlign: "center", cursor: "pointer", color: "#f00" },
        Cell: row => (
          <div
            onClick={() => {
              this.toggleDeleteConfirmation(row.value);
            }}
          >
            <IconDelete />
          </div>
        )
      }
    ];
    const rowId = this.state.rowId;
    return (
      <div>
        <h3>Строки для табличной части: {part.name}</h3>
        <ReactTable
          data={rows }
          manual
          columns={headers}
          loadingText="Загрузка данных..."
          minRows={4}
          noDataText="Нет данных"
          showPagination={false}
          sortable={false}
          className={classNames({
            ReactTable: true,
            "-striped": true
          })}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            goStep(step - 1);
          }}
        >
          Назад
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            this.toggleEditor(0);
          }}
        >
          Добавить
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            goStep(step + 1);
          }}
        >
          Продолжить
        </button>
        <ModalForm
          zIndex={100}
          isShown={!!rowId || rowId === 0}
          header={rowId ? "Изменение строки" : "Добавление строки"}
        >
          <TableRowEditor
            partId={part.id}
            rowId={rowId}
            rows={rows} // for parent row selector
            onCancel={() => {
              this.toggleEditor();
            }}
          />
        </ModalForm>
        <ModalForm
          isShown={!!this.state.rowIdToDelete}
          header="Подтверждение удаления"
        >
          <div>
            <div>Удалить строку?</div>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.onRowDeletion}
            >
              Да
            </button>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={() => {
                this.toggleDeleteConfirmation();
              }}
            >
              Нет
            </button>
          </div>
        </ModalForm>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    step: state.configurator.formCtor.step,
    needToLoad: !state.configurator.formCtor.tableParts.byId[props.part.id].rows,
    rows: getRowListByPart(state, props.part.id)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    goStep: step => {
      dispatch(formCtorActions.formCtorSetStep(step));
    },
    loadRows: () => dispatch(loadRows(props.part.id)),
    deleteRow: (rowId, onError, onSuccess) =>
      dispatch(deleteRow(props.part.id, rowId, onError, onSuccess)),
    showErrorMessage: error => dispatch(setMessage(error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableRows);
