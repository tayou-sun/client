import { combineReducers } from "redux";
import { createSelector } from "reselect";
import _ from "lodash";
import * as actions from "./actions";
import * as formCtorActions from "../formCtor/actions";

function byId(state = null, action) {
  switch (action.type) {
    case actions.RECEIVE_COLUMNS:
      return {
        ...state,
        ...action.data
      };
    case actions.ADD_COLUMN:
    case actions.UPDATE_COLUMN:
      return {
        ...state,
        [action.data.id]: action.data
      };
    case actions.DELETE_COLUMN:
      const { [action.columnId]: column, ...newState } = state;
      return newState;
    case formCtorActions.FORM_CTOR_EXIT:
      return null;
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case actions.RECEIVE_COLUMNS:
      return state.concat(_.keys(action.data));
    case actions.ADD_COLUMN:
      return state.concat(action.data.id);
    case actions.DELETE_COLUMN:
      return state.filter(id => id !== action.columnId);
    case formCtorActions.FORM_CTOR_EXIT:
      return [];
    default:
      return state;
  }
}

export default combineReducers({
  byId: byId,
  allIds: allIds
});

export const getColumnListByPart = (state, partId) => {
  const columnIds = state.configurator.formCtor.tableParts.byId[partId].columns;
  if (!columnIds) return [];

  const columns = state.configurator.formCtor.tableColumns.byId;

  return _.orderBy(columnIds.map(id => {
    const column = columns[id];
    return {
      id,
      columnNumber: column.columnNumber,
      name: column.name,
      valueType: column.valueTypeId ?
        (state.configurator.dicts.valueTypes.byId ?
          state.configurator.dicts.valueTypes.byId[column.valueTypeId] : "Загрузка...") : null,
      unit: column.unitId ?
        (state.configurator.dicts.units.byId ?
          state.configurator.dicts.units.byId[column.unitId].symbolicName ||
          state.configurator.dicts.units.byId[column.unitId].name : "Загрузка...") : null,
      member: column.memberId ?
        (state.configurator.dicts.members.byId ?
          state.configurator.dicts.members.byId[column.memberId] : "Загрузка...") : null,
      dimension: column.dimensionId ?
        (state.configurator.dicts.dimensions.byId ?
          state.configurator.dicts.dimensions.byId[column.dimensionId] : "Загрузка...") : null,
      parentColumn: column.parentColumnId && columns[column.parentColumnId] && column.id !== columns[column.parentColumnId].id ? columns[column.parentColumnId].name : null,
      isSumOfChildren: column.isSumOfChildren,
      description: column.description,
      sortOrder: column.sortOrder
    };
  }), ["sortOrder"], ["asc"]);
}