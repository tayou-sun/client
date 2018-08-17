import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import classNames from "classnames";
import IconCheck from "react-icons/lib/md/check";
import IconEdit from "react-icons/lib/fa/edit";
import IconDelete from "react-icons/lib/fa/close";
import { setMessage } from "../store/main/actions";
import * as formCtorActions from "../store/formCtor/actions";
import { getColumnListByPart } from "../store/tableColumns/reducer";
import { loadColumns, deleteColumn } from "../store/tableColumns/actions";
import ModalForm from "./ModalForm";
import TableColumnEditor from "./TableColumnEditor";

class TableColumns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnId: null,
      columnIdToDelete: null
    };
    this.toggleEditor = this.toggleEditor.bind(this);
    this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
    this.onColumnDeletion = this.onColumnDeletion.bind(this);
  }

  componentDidMount() {
    const { needToLoad, loadColumns } = this.props;
    if (needToLoad) loadColumns();
  }

  toggleEditor(columnId) {
    this.setState({ columnId });
  }

  toggleDeleteConfirmation(columnIdToDelete) {
    this.setState({ columnIdToDelete });
  }

  onColumnDeletion() {
    this.props.deleteColumn(
      this.state.columnIdToDelete,
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
    const { part, step, goStep, columns } = this.props;
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
        accessor: "columnNumber",
        maxWidth: 60,
        style: { textAlign: "right", paddingRight: "10px" }
      },
      { Header: "Наименование", accessor: "name", minWidth: 300 },
      { Header: "Тип значений", accessor: "valueType" },
      { Header: "Ед.изм.", accessor: "unit" },
      { Header: "Показатель", accessor: "member" },
      { Header: "Измерение", accessor: "dimension" },
      { Header: "Родит. столбец", accessor: "parentColumn" },
      {
        Header: "Суммарный",
        accessor: "isSumOfChildren",
        Cell: row => {
          return row.value ? (
            <div style={{ textAlign: "center" }}>
              <IconCheck className="icon-check" />
            </div>
          ) : null;
        }
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
    const columnId = this.state.columnId;
    return (
      <div>
        <h3>Столбцы для табличной части: {part.name}</h3>
        <ReactTable
          data={columns || []}
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
          isShown={!!columnId || columnId === 0}
          header={columnId ? "Изменение столбца" : "Добавление столбца"}
        >
          <TableColumnEditor
            partId={part.id}
            columnId={columnId}
            columns={columns}
            onCancel={() => {
              this.toggleEditor();
            }}
          />
        </ModalForm>
        <ModalForm
          isShown={!!this.state.columnIdToDelete}
          header="Подтверждение удаления"
        >
          <div>
            <div>Удалить столбец?</div>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.onColumnDeletion}
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
    needToLoad: !state.configurator.formCtor.tableParts.byId[props.part.id].columns,
    columns: getColumnListByPart(state, props.part.id)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    goStep: step => {
      dispatch(formCtorActions.formCtorSetStep(step));
    },
    loadColumns: () => dispatch(loadColumns(props.part.id)),
    deleteColumn: (columnId, onError, onSuccess) =>
      dispatch(deleteColumn(props.part.id, columnId, onError, onSuccess)),
    showErrorMessage: error => dispatch(setMessage(error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableColumns);
