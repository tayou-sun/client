import api from "../../../../api/configurator";
import * as mainActions from "../main/actions";
import { getCurrentFormId } from "../formCtor/formId/reducer";

export const RECEIVE_PARTS = "RECEIVE_PARTS";
export const ADD_PART = "ADD_PART";
export const UPDATE_PART = "UPDATE_PART";
export const DELETE_TABLE_PART = "DELETE_TABLE_PART";

export function loadTableParts() {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api.getTableParts(formId)
      .then(data =>
        dispatch({
          type: RECEIVE_PARTS,
          data: data
        })
      )
      .then(() => {
        dispatch(mainActions.stopLoading());
      });
  };
}

export function saveTablePart(data, onError, onSuccess) {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api.saveTablePart(formId, data)
      .then(response => {
        if (response.error) {
          if (typeof(onError) === "function")
            onError(response.error);
          return;
        }
        dispatch({
          type: data.id ? UPDATE_PART : ADD_PART,
          data: response
        });
        if (typeof(onSuccess) === "function")
          onSuccess();
      })
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
        dispatch(mainActions.stopLoading());
      });
  };
}

export function deleteTablePart(partId, onError, onSuccess) {
  return (dispatch, getState) => {
    const formId = getCurrentFormId(getState());
    return (
      api.deleteTablePart(formId, partId)
      .then(response => {
        if (response.error) {
          if (typeof(onError) === "function")
            onError(response.error);
          return;
        }
        dispatch({
          type: DELETE_TABLE_PART,
          partId
        });
        if (typeof(onSuccess) === "function")
          onSuccess();
      })
      .catch(error => {
        console.log(error);
      })
    );
  };
}