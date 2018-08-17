import React, { Component } from "react";
import { connect } from "react-redux";
import * as formCtorActions from "../store/formCtor/actions";
import { saveForm, deleteForm } from "../store/forms/actions";
import { getPeriodList } from "../store/dicts/reducer";
import { loadTablePartTypes, loadMembers } from "../store/dicts/actions";
import ModalForm from "./ModalForm";
import { getCurrentFormId } from "../store/formCtor/formId/reducer";

class FormDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.data.name || "",
      description: props.data.description || "",
      periodId: props.data.periodId || "",
      isDirty: false,
      error: "",
      deleteConfirmation: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
    this.handleFormDeletion = this.handleFormDeletion.bind(this);
  }

  componentDidMount() {
    // optimistic dictionaries background loading
    this.props.loadDictionaries();
  }

  handleInputChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value, isDirty: true, error:"" });
  }

  toggleDeleteConfirmation() {
    this.setState(prevState => {
      return { deleteConfirmation: !prevState.deleteConfirmation };
    });
  }

  handleFormDeletion() {
    const { deleteForm, formId } = this.props;
    this.toggleDeleteConfirmation();
    deleteForm(formId);
  }

  renderContinueBtn() {
    const { formId, onSaveContinue, onContinue } = this.props;
    const isDirty = this.state.isDirty;
    const err = this.state.error;
    if (isDirty)
      return (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            this.setState({ isDirty: false, error: "" });
            onSaveContinue(
              {
                id: formId,
                name: this.state.name,
                description: this.state.description,
                periodId: this.state.periodId
              },
              error => {
                this.setState({ error });
              }
            );
          }}
        >
          Продолжить
        </button>
      );
    return (
      <button
        type="button"
        className="btn btn-outline-success"
        disabled={err || formId === 0}
        onClick={onContinue}
      >
        Продолжить
      </button>
    );
  }

  render() {
    const { formId, onCancel, periods } = this.props;
    const error = this.state.error;
    return (
      <div>
        {formId == 0 ? (
          <h3>Создание формы</h3>
        ) : (
          <h3>
            Изменение формы
            <span
              style={{
                fontSize: "0.7em",
                marginLeft: "20px",
                color: "#f00",
                cursor: "pointer"
              }}
              onClick={this.toggleDeleteConfirmation}
            >
              Удалить
            </span>
          </h3>
        )}
        {error && (
          <div style={{ fontWeight: "bold", color: "red" }}>
            Ошибка: {error}
          </div>
        )}
        <form>
          <div className="form-group">
            <label>
              Наименование
              <input
                className="form-control"
                value={this.state.name}
                name="name"
                type="text"
                onChange={this.handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Описание
              <input
                className="form-control"
                value={this.state.description}
                name="description"
                type="text"
                onChange={this.handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Период
              <select
                className="form-control"
                value={this.state.periodId}
                name="periodId"
                onChange={this.handleInputChange}
              >
                <option value="" />
                {periods.map(period => (
                  <option value={period.id} key={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onCancel}
        >
          Отменить
        </button>
        {this.renderContinueBtn()}
        <ModalForm
          isShown={this.state.deleteConfirmation}
          header="Подтверждение удаления"
        >
          <div>
            <div>Удалить форму?</div>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.handleFormDeletion}
            >
              Да
            </button>
            <button
              type="button"
              className="btn modalForm-btn"
              onClick={this.toggleDeleteConfirmation}
            >
              Нет
            </button>
          </div>
        </ModalForm>
      </div>
    );
  }
}

/* eslint-disable indent */
const mapStateToProps = state => {
  const formId = getCurrentFormId(state);
  return {
    formId,
    data: formId === 0 ? {} : state.configurator.forms.byId[formId] || {},
    periods: getPeriodList(state)
  };
};
/* eslint-enable indent */

const mapDispatchToProps = dispatch => {
  return {
    onSaveContinue: (data, setError) => dispatch(saveForm(data, setError)),
    onContinue: () => dispatch(formCtorActions.formCtorSetStep(2)),
    onCancel: () => dispatch(formCtorActions.formCtorExit()),
    deleteForm: formId => dispatch(deleteForm(formId)),
    loadDictionaries: () =>
      Promise.resolve()
        .then(() => dispatch(loadTablePartTypes()))
        .then(() => dispatch(loadMembers()))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormDetails);
