import * as actions from "./actions";
import * as formsActions from "../../forms/actions";
import * as formCtorActions from "../../formCtor/actions";

export default function (state = null, action) {
  switch (action.type) {
    case actions.SET_FORM_ID:
      return action.formId;
    case formsActions.ADD_FORM:
      return action.data.id;
    case formCtorActions.FORM_CTOR_EXIT:
      return null;
    default:
      return state;
  }
}

export const getCurrentFormId = state => state.configurator.formCtor.formId;