import * as actions from "./actions";

export default function (state={}, action) {
  switch(action.type) {
    case actions.FORMS_REFRESH:
      return {
        ...state,
        ...action.forms
      };
    default:
      return state;
  }
}