export const START_LOADING = "START_LOADING";
export const STOP_LOADING = "STOP_LOADING";
export const SET_MESSAGE = "SET_MESSAGE";

export function startLoading() {
  return {
    type: START_LOADING
  };
}

export function stopLoading() {
  return {
    type: STOP_LOADING
  };
}

export function setMessage(message) {
  return {
    type: SET_MESSAGE,
    message
  };
}