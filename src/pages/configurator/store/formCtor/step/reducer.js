import * as formsActions from "../../forms/actions";
import * as actions from "./actions";

export default function step(state = 1, action) {
  switch (action.type) {
    case actions.FORM_CTOR_SET_STEP:
      return action.data;
    case actions.FORM_CTOR_EXIT:
      return 1;
    case formsActions.ADD_FORM:
    case formsActions.UPDATE_FORM:
      return 2;
    default:
      return state;
  }
}
