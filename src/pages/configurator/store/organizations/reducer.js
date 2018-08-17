import * as actions from "./actions";

export default function(state = null, action) {
  switch(action.type) {
    case actions.ORGANIZATIONS_RECEIVE_DATA:
      return action.data;
    default:
      return state;
  };
}