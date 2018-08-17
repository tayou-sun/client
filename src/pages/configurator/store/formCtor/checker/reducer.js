import * as actions from "./actions";
import { FORM_CTOR_EXIT } from "../actions";
import { ADD_PART, DELETE_TABLE_PART, UPDATE_PART } from "../../tableParts/actions";
import { ADD_COLUMN, DELETE_COLUMN, UPDATE_COLUMN } from "../../tableColumns/actions";

const initialState = {
  messages: [],
  needToRun: true,
  completed: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.START_CHECKING:
      return {
        ...state,
        messages: [],
        needToRun: false,
        completed: false
      }
    case actions.RECEIVE_MESSAGES:
      return {
        ...state,
        messages: action.messages,
        completed: true
      };
    case FORM_CTOR_EXIT:
      return initialState;
    case ADD_PART:
    case DELETE_TABLE_PART:
    case UPDATE_PART:
    case ADD_COLUMN:
    case DELETE_COLUMN:
    case UPDATE_COLUMN:
      return {
        ...state,
        needToRun: true
      }
    default:
      return state;
  }
}