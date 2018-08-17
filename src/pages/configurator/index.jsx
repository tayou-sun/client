import React, { Component } from "react";
import { connect } from "react-redux";
import VirtualizedSelect from "./components/ReactVirtualizedSelect";
import FormConstructor from "./components/FormConstructor";
import Loader from "./components/Loader";
import FormList from "./components/FormList";
import { setMessage } from "./store/main/actions";
import { loadPeriods } from "./store/dicts/actions";
import { loadForms, selectOrganization } from "./store/forms/actions";
import { getFormList, getCurrentOrgId } from "./store/forms/reducer";
import ModalForm from "./components/ModalForm";
import { getCurrentFormId } from "./store/formCtor/formId/reducer";
import { setFormId } from "./store/formCtor/formId/actions";
import { loadOrganizations } from "./store/organizations/actions";

class Configurator extends Component {
  constructor(props) {
    super(props);
    this.handleOrganizationChange = this.handleOrganizationChange.bind(this);
  }

  componentDidMount() {
    const { needToLoad, dispatch } = this.props;
    if (needToLoad)
      dispatch(loadOrganizations()).then(() => dispatch(loadPeriods()));
  }

  handleOrganizationChange(orgId) {
    this.props.dispatch(selectOrganization(orgId));
    this.props.dispatch(loadForms(orgId));
  }

  render() {
    const {
      isLoading,
      currentOrgId,
      organizations,
      currentFormId,
      forms,
      dispatch,
      message
    } = this.props;
    return (
      <div className="configuratorPage">
        <Loader enabled={isLoading} />
        {currentFormId || currentFormId === 0 ? (
          <FormConstructor />
        ) : (
          <div>
            <div style={{ maxWidth: "500px", marginBottom: "20px" }}>
              <label>Организация</label>
              <VirtualizedSelect
                options={organizations}
                simpleValue
                clearable
                value={currentOrgId}
                onChange={this.handleOrganizationChange}
                searchable
                valueKey="id"
                labelKey="name"
                placeholder="Выберите организацию..."
                noResultsText="Нет данных"
              />
            </div>
            <FormList
              orgId={currentOrgId}
              forms={forms}
              onSelectForm={id => {
                dispatch(setFormId(id));
              }}
            />
          </div>
        )}
        <ModalForm
          isShown={!!message}
          header="Конфигуратор"
          onOverlayClick={() => dispatch(setMessage())}
        >
          <div>
            <div>{message}</div>
            <button
              type="button"
              className="btn"
              onClick={() => dispatch(setMessage())}
            >
              OK
            </button>
          </div>
        </ModalForm>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    needToLoad: !state.configurator.organizations,
    organizations: state.configurator.organizations,
    currentOrgId: getCurrentOrgId(state),
    currentFormId: getCurrentFormId(state),
    isLoading: state.configurator.main.isLoading,
    forms: getFormList(state),
    message: state.configurator.main.message
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     loadOrganizations: () => dispatch(loadOrganizations()),
//     loadPeriods: () => dispatch(loadPeriods()),
//     selectOrganization: (id) => dispatch(selectOrganization(id))
//   };
// };

export default connect(mapStateToProps)(Configurator);
