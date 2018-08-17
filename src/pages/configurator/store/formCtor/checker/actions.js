import api from "../../../../../api/configurator";
import { getCurrentFormId } from "../formId/reducer";
import { startLoading, stopLoading } from "../../main/actions";

export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const START_CHECKING = "START_CHECKING";

export function checkForm() {
  return (dispatch, getState) => {
    dispatch({ type: START_CHECKING });
    dispatch(startLoading());
    const formId = getCurrentFormId(getState());

    return (
      api.getFormCheckerMessages(formId)
      .then(response => {
        if (response.error) {
          console.log(response.error);
          return;
        }
        dispatch({
          type: RECEIVE_MESSAGES,
          messages: response
        });
      })
      .then(() => dispatch(stopLoading()))
    );
  };
};