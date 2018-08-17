import { combineReducers } from "redux";
import { createSelector } from "reselect";
import _ from "lodash";
import * as actions from "./actions";

function byId(state = null, action) {
  switch (action.type) {
    case actions.FORMS_RECEIVE_DATA:
      return action.data;
    case actions.ADD_FORM:
    case actions.UPDATE_FORM:
      return {
        ...state,
        [action.data.id]: action.data
      };
    case actions.DELETE_FORM:
      const { [action.formId]: form, ...newState } = state;
      return newState;
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case actions.FORMS_RECEIVE_DATA:
      return _.keys(action.data);
    case actions.ADD_FORM:
      return state.concat(action.data.id);
    case actions.DELETE_FORM:
      return state.filter(id => id !== action.formId);
    default:
      return state;
  }
}

function orgId(state = null, action) {
  switch (action.type) {
    case actions.FORMS_SELECT_ORGANIZATION:
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  allIds,
  orgId
});

const getFormIds = state => state.configurator.forms.allIds;
const getFormsById = state => state.configurator.forms.byId;
const getPeriodsById = state => state.configurator.dicts.periods.byId;

export const getFormList = createSelector(
  [getFormIds, getFormsById, getPeriodsById],
  (formIds, formsById, periods) => {
    if (formIds.length === 0) return [];
    return formIds.map(id => {
      const form = formsById[id];
      return {
        id,
        name: form.name,
        description: form.description,
        period: periods ? periods[form.periodId] : ""
      }
    });
  }
);

export const getCurrentOrgId = state => state.configurator.forms.orgId;