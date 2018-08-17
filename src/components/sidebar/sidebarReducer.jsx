import { SIDEBAR__SHOW, SIDEBAR__HIDE } from "./sidebarConstants";
import _ from "lodash";

const initialState = {
  isActive: false
};

export default function sidebar(state = initialState, action) {
  switch (action.type) {
    case SIDEBAR__HIDE:
      return {
        ...state,
        isActive: false
      };

    case SIDEBAR__SHOW:
      return {
        ...state,
        isActive: true
      };
    default:
      return state;
  }
}
