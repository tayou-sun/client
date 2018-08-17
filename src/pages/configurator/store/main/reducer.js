import * as actions from "./actions";
import * as formsActions from "../forms/actions";
import * as formCtorActions from "../formCtor/actions";

const initialState = {
  isLoading: false,
  message: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case actions.STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case actions.SET_MESSAGE:
      return {
        ...state,
        message: action.message
      };
    default:
      return state;
  }
}