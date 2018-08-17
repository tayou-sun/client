import * as mainActions from "../main/actions";
import api from "../../../../api/configurator";
import { getCurrentFormId } from "../formCtor/formId/reducer";

export const RECEIVE_ROWS = "RECEIVE_ROWS";
export const ADD_ROW = "ADD_ROW";
export const UPDATE_ROW = "UPDATE_ROW";
export const DELETE_ROW = "DELETE_ROW";

export function receiveRows(partId, data) {
  return {
    type: RECEIVE_ROWS,
    partId,
    data
  };
}

export function loadRows(partId) {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api
      .getTableRows(formId, partId)
      .then(data => dispatch(receiveRows(partId, data)))
      .then(() => dispatch(mainActions.stopLoading()));
  };
}

export function saveRow(partId, data, onError, onSuccess) {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api
      .postTableRow(formId, partId, data)
      .then(response => {
        if (response.error) {
          if (typeof(onError) === "function") onError(response.error);
          return;
        }
        dispatch({
          type: data.id ? UPDATE_ROW : ADD_ROW,
          partId,
          data: response
        });
        if (typeof(onSuccess) === "function") onSuccess();
      })
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
      });
  };
}

export function deleteRow(partId, rowId, onError, onSuccess) {
  return (dispatch, getState) => {
    const formId = getCurrentFormId(getState());
    return (
      api.deleteTableRow(formId, partId, rowId)
      .then(response => {
        if (response.error) {
          if (typeof(onError) === "function")
            onError(response.error);
          return;
        }
        dispatch({
          type: DELETE_ROW,
          partId,
          rowId
        });
        if (typeof(onSuccess) === "function")
          onSuccess();
      })
      .catch(error => {
        console.log(error);
      })
    );
  }
}