import api from "../../../../api/configurator";
import * as mainActions from "../main/actions";
import * as formCtorActions from "../formCtor/actions";
import { getCurrentFormId } from "../formCtor/formId/reducer";
import { getCurrentOrgId } from "./reducer";

export const SAVE_FORM_TO_LIST = "SAVE_FORM_TO_LIST";
export const FORMS_RECEIVE_DATA = "FORMS_RECEIVE_DATA";
export const ADD_FORM = "ADD_FORM";
export const UPDATE_FORM = "UPDATE_FORM";
export const DELETE_FORM = "DELETE_FORM";
export const FORMS_SELECT_ORGANIZATION = "FORMS_SELECT_ORGANIZATION";

export function receiveData(data) {
  return {
    type: FORMS_RECEIVE_DATA,
    data
  };
}

export function saveFormToList(data) {
  return {
    type: SAVE_FORM_TO_LIST,
    data
  };
}

export function selectOrganization(data) {
  return {
    type: FORMS_SELECT_ORGANIZATION,
    data
  };
}

export function loadForms(orgId) {
  return dispatch => {
    dispatch(
      mainActions.startLoading()
    );
    return api.getForms(orgId)
      .then(data => dispatch(receiveData(data)))
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
        dispatch(mainActions.stopLoading());
      });
  };
}

export function saveForm(form, onError) {
  return (dispatch, getState) => {
    const state = getState();
    const formId = getCurrentFormId(state);
    const orgId = getCurrentOrgId(state);
    dispatch(mainActions.startLoading());
    form.id = formId;
    form.orgId = orgId;
    return api.saveFormDetails(form)
      .then(data => {
        if (data.error) {
          if (onError) onError(data.error);
          return;
        }
        dispatch({
          type: formId ? UPDATE_FORM : ADD_FORM,
          data
        });
      })
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
        dispatch(mainActions.stopLoading());
      });
  };
}

export function deleteForm(formId) {
  return dispatch => {
    dispatch(
      mainActions.startLoading()
    );
    return api.deleteForm(formId)
      .then(response => {
        if (response.error)
          throw new Error(response.error);
        dispatch({
          type: DELETE_FORM,
          formId
        });
      })
      .then(() => dispatch(formCtorActions.formCtorExit()))
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
        dispatch(mainActions.stopLoading());
      });
  };
}

