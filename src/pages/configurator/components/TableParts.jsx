import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import IconRightArrow from "react-icons/lib/fa/arrow-right";
import IconEdit from "react-icons/lib/fa/edit";
import IconDelete from "react-icons/lib/fa/close";
import classNames from "classnames";
import { setMessage } from "../store/main/actions";
import {
  loadUnits,
  loadDimensions,
  loadValueTypes
} from "../store/dicts/actions";
import { loadTableParts, deleteTablePart } from "../store/tableParts/actions";
import { getPartList } from "../store/tableParts/reducer";
import * as formCtorActions from "../store/formCtor/actions";
import TablePartEditor from "./TablePartEditor";
import ModalForm from "./ModalForm";
import TableManagement from "../../../components/layout/table/TableManagement";

class TableParts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partId: null,
      partIdToDelete: null
    };
    this.toggleEditor = this.toggleEditor.bind(this);
    this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
    this.onTablePartDeletion = this.onTablePartDeletion.bind(this);
  }

  componentDidMount() {
    const {
      noParts,
      loadTableParts,
      loadUnits,
      loadDimensions,
      loadValueTypes
    } = this.props;

    if (noParts)
      loadTableParts()
        .then(() => loadUnits())
        .then(() => loadDimensions())
        .then(() => loadValueTypes());
  }

  toggleEditor(partId) {
    this.setState({ partId });
  }

  toggleDeleteConfirmation(partIdToDelete) {
    this.setState({ partIdToDelete });
  }

  onTablePartDeletion() {
    this.props.deleteTablePart(
      this.state.partIdToDelete,
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
    const { goStep, partList } = this.props;

    const columns = [
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
        accessor: "sortOrder",
        maxWidth: 60,
        style: { textAlign: "right", paddingRight: "10px" }
      },
      { Header: "Наименование", accessor: "name" },
      { Header: "Тип", accessor: "type" },
      { Header: "Показатель", accessor: "member" },
      {
        Header: "К строкам",
        accessor: "id",
        maxWidth: 80,
        style: { textAlign: "center", cursor: "pointer" },
        Cell: row => (
          <div
            onClick={() => {
              goStep(row.index * 2 + 3);
            }}
          >
            <IconRightArrow />
          </div>
        )
      },
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
   
    const partId = this.state.partId;
    return (
      <div>
        <h3>Табличные части</h3>
        <ReactTable
          data={partList}
          manual
          columns={columns}
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
        <TableManagement/>
        <button
          type="button"
          className="btn"
          onClick={() => {
            goStep(1);
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
          className="btn"
          onClick={() => {
            goStep(3);
          }}
        >
          Продолжить
        </button>
        <ModalForm
          zIndex={100}
          isShown={!!partId || partId === 0}
          header={
            partId ? "Изменение табличной части" : "Добавление табличной части"
          }
        >
          <TablePartEditor
            partId={partId}
            onClose={() => {
              this.toggleEditor();
            }}
          />
        </ModalForm>
        <ModalForm
          isShown={!!this.state.partIdToDelete}
          header="Подтверждение удаления"
        >
          <div>
            <div>Удалить табличную часть?</div>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.onTablePartDeletion}
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

const mapStateToProps = state => {
  return {
    noParts: state.configurator.formCtor.tableParts.byId === null,
    partList: getPartList(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goStep: step => {
      dispatch(formCtorActions.formCtorSetStep(step));
    },
    loadTableParts: () => dispatch(loadTableParts()),
    loadUnits: () => dispatch(loadUnits()),
    loadDimensions: () => dispatch(loadDimensions()),
    loadValueTypes: () => dispatch(loadValueTypes()),
    deleteTablePart: (partId, onError, onSuccess) =>
      dispatch(deleteTablePart(partId, onError, onSuccess)),
    showErrorMessage: error => dispatch(setMessage(error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableParts);
