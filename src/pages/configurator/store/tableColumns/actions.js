import * as mainActions from "../main/actions";
import api from "../../../../api/configurator";
import { getCurrentFormId } from "../formCtor/formId/reducer";

export const RECEIVE_COLUMNS = "RECEIVE_COLUMNS";
export const ADD_COLUMN = "ADD_COLUMN";
export const UPDATE_COLUMN = "UPDATE_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";

export function receiveColumns(partId, data) {
  return {
    type: RECEIVE_COLUMNS,
    partId,
    data
  };
}

export function loadColumns(partId) {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api
      .getTableColumns(formId, partId)
      .then(data => dispatch(receiveColumns(partId, data)))
      .then(() => dispatch(mainActions.stopLoading()));
  };
}

export function saveColumn(partId, data, onError, onSuccess) {
  return (dispatch, getState) => {
    dispatch(mainActions.startLoading());
    const formId = getCurrentFormId(getState());
    return api
      .postTableColumn(formId, partId, data)
      .then(response => {
        if (response.error) {
          if (onError) onError(response.error);
          return;
        }
        dispatch({
          type: data.id ? UPDATE_COLUMN : ADD_COLUMN,
          partId,
          data: response
        });
        if (onSuccess) onSuccess();
      })
      .then(() => dispatch(mainActions.stopLoading()));
  };
}

export function deleteColumn(partId, columnId, onError, onSuccess) {
  return (dispatch, getState) => {
    const formId = getCurrentFormId(getState());
    return (
      api.deleteTableColumn(formId, partId, columnId)
      .then(response => {
        if (response.error) {
          if (typeof(onError) === "function")
            onError(response.error);
          return;
        }
        dispatch({
          type: DELETE_COLUMN,
          partId,
          columnId
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