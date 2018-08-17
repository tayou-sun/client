import api from "../../../../api/dataCollector";
import * as mainActions from "../main/actions";

export const ORGANIZATIONS_RECEIVE_DATA = "ORGANIZATIONS_RECEIVE_DATA";

export function receiveData(data) {
  return {
    type: ORGANIZATIONS_RECEIVE_DATA,
    data
  };
}

export function loadOrganizations() {
  return dispatch => {
    dispatch(
      mainActions.startLoading()
    );
    return api.getOrganizations()
      .then(data => dispatch(receiveData(data)))
      .then(() => dispatch(mainActions.stopLoading()))
      .catch(error => {
        console.log(error);
        dispatch(mainActions.stopLoading());
      });
  };
}
