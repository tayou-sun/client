import {
  combineReducers
} from "redux";
import _ from "lodash";
import {
  createSelector
} from "reselect";
import * as actions from "./actions";
import * as formCtorActions from "../formCtor/actions";
import * as rowsActions from "../tableRows/actions";
import * as columnsActions from "../tableColumns/actions";

function byId(state = null, action) {
  switch (action.type) {
    case actions.RECEIVE_PARTS:
      return action.data;
    case actions.ADD_PART:
      return {
        ...state,
        [action.data.id]: {
          ...action.data,
          rows: [],
          columns: []
        }
      };
    case actions.UPDATE_PART:
      return {
        ...state,
        [action.data.id]: {
          ...state[action.data.id],
          ...action.data
        }
      }
    case actions.DELETE_TABLE_PART:
      const { [action.partId]: part, ...newState } = state;
      return newState;
    case rowsActions.RECEIVE_ROWS:
      return {
        ...state,
        [action.partId]: {
          ...state[action.partId],
          rows: _.keys(action.data)
        }
      };
    case rowsActions.ADD_ROW:
      return {
        ...state,
        [action.partId]: {
          ...state[action.partId],
          rows: (state[action.partId].rows || []).concat(action.data.id)
        }
      };
    case rowsActions.DELETE_ROW:
      return {
        ...state,
        [action.partId] : {
          ...state[action.partId],
          rows: state[action.partId].rows.filter(id => id !== action.rowId)
        }
      };
    case columnsActions.RECEIVE_COLUMNS:
      return {
        ...state,
        [action.partId]: {
          ...state[action.partId],
          columns: _.keys(action.data)
        }
      };
    case columnsActions.ADD_COLUMN:
      return {
        ...state,
        [action.partId]: {
          ...state[action.partId],
          columns: (state[action.partId].columns || []).concat(action.data.id)
        }
      };
    case columnsActions.DELETE_COLUMN:
      return {
        ...state,
        [action.partId] : {
          ...state[action.partId],
          columns: state[action.partId].columns.filter(id => id !== action.columnId)
        }
      };
    case formCtorActions.FORM_CTOR_EXIT:
      return null;
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case actions.RECEIVE_PARTS:
      return _.keys(action.data);
    case actions.ADD_PART:
      return state.concat(action.data.id);
    case actions.DELETE_TABLE_PART:
      return state.filter(id => id !== action.partId);
    case formCtorActions.FORM_CTOR_EXIT:
      return [];
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  allIds
});

const getTablePartIds = state => state.configurator.formCtor.tableParts.allIds;
const getTablePartsById = state => state.configurator.formCtor.tableParts.byId;
const getTablePartTypes = state => state.configurator.dicts.tablePartTypes.byId;
const getMembersById = state => state.configurator.dicts.members.byId;

export const getPartList = createSelector(
  [getTablePartIds, getTablePartsById, getTablePartTypes, getMembersById],
  (partIds, partsById, partTypes, members) => {
    if (partIds.length === 0) return [];

    return _.orderBy(partIds.map(id => {
      const part = partsById[id];
      return {
        id,
        name: part.name,
        sortOrder: part.sortOrder,
        type: part.typeId ? (partTypes ? partTypes[part.typeId] : "Загрузка...") : "",
        member: part.memberId ? (members ? members[part.memberId] : "Загрузка...") : ""
      };
    }), ["sortOrder"], ["asc"]);
  })