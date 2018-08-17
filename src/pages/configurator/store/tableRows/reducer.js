import _ from "lodash";
import {
  combineReducers
} from "redux";
import * as actions from "./actions";
import * as formCtorActions from "../formCtor/actions";
import * as partsActions from "../tableParts/actions";
import {
  createSelector
} from "reselect";

function byId(state = null, action) {
  switch (action.type) {
    case actions.RECEIVE_ROWS:
      return {
        ...state,
        ...action.data
      };
    case actions.ADD_ROW:
    case actions.UPDATE_ROW:
      return {
        ...state,
        [action.data.id]: action.data
      };
    case actions.DELETE_ROW:
      const {
        [action.rowId]: row, ...newState
      } = state;
      return newState;
    case formCtorActions.FORM_CTOR_EXIT:
      return null;
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case actions.RECEIVE_ROWS:
      return state.concat(_.keys(action.data));
    case actions.ADD_ROW:
      return state.concat(action.data.id);
    case actions.DELETE_ROW:
      return state.filter(id => id !== action.rowId);
    case formCtorActions.FORM_CTOR_EXIT:
      return [];
    default:
      return state;
  }
}

function byPart(state = {}, action) {
  switch (action.type) {
    case actions.RECEIVE_ROWS:
      return {
        ...state,
        [action.partId]: {
          byId: action.data,
          allIds: _.keys(action.data)
        },
      };
    case actions.ADD_ROW:
      let part = state[action.partId];
      return {
        ...state,
        [action.partId]: {
          byId: { ...part.byId,
            [action.data.id]: action.data
          },
          allIds: (part.allIds || []).concat(action.data.id)
        }
      };
    case actions.UPDATE_ROW:
      let part1 = state[action.partId];
      return {
        ...state,
        [action.partId]: {
          byId: { ...part1.byId,
            [action.data.id]: action.data
          },
          allIds: part1.allIds
        }
      };
    case actions.DELETE_ROW:
      const part2 = state[action.partId];
      const {
        [action.rowId]: row, newById
      } = part2.byId;
      return {
        ...state,
        [action.partId]: {
          byId: newById,
          allIds: part2.allIds.filter(id => id !== action.rowId)
        }
      };
    case partsActions.ADD_PART:
      return {
        ...state,
        [action.data.id]: {
          byId: {},
          allIds: []
        }
      }
    case partsActions.DELETE_TABLE_PART:
      const {
        [action.partId]: rows, ...newState
      } = state;
      return newState;
    case formCtorActions.FORM_CTOR_EXIT:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  allIds,
  byPart
});


const getRows = (state, props) => {
  const rows = state.configurator.formCtor.tableRows.byPart[props.part.id];
  if (!rows) return null;
};

const getUnits = state => state.configurator.dicts.units.byId;
const getMembers = state => state.configurator.dicts.members.byId;
const getDimensions = state => state.configurator.dicts.dimensions.byId;

export const makeGetRowList = () => {
  return createSelector(
    [getRows, getUnits, getMembers, getDimensions],
    (rows, units, members, dimensions) => {
      if (rows === null) return [];
      console.log('rows selector'); //vlr
      return _.orderBy(rows.allIds.map(id => {
        const row = rows.byId[id];
        return {
          id,
          name: row.name,
          rowNumber: row.rowNumber,
          unit: row.unitId ?
            (units ?
              units[row.unitId].symbolicName ||
              units[row.unitId].name : "Загрузка...") : null,
          member: row.memberId ?
            (members ? members[row.memberId] : "Загрузка...") : null,
          dimension: row.dimensionId ?
            (dimensions ? dimensions[row.dimensionId] : "Загрузка...") : null,
          parentRow: row.parentRowId && row.rowNumber !== rows.byId[row.parentRowId].rowNumber ?
            rows.byId[row.parentRowId].rowNumber : null,
          isText: row.isText,
          isSumOfChildren: row.isSumOfChildren,
          isColumnsUnion: row.isColumnsUnion,
          description: row.description,
          sortOrder: row.sortOrder
        };
      }), ["sortOrder"], ["asc"]);
    }
  );
}

export const getRowListByPart = (state, partId) => {
  const rowIds = state.configurator.formCtor.tableParts.byId[partId].rows;
  if (!rowIds) return [];

  const rows = state.configurator.formCtor.tableRows.byId;
  return _.orderBy(rowIds.map(id => {
    const row = rows[id];
    return {
      id,
      name: row.name,
      rowNumber: row.rowNumber,
      unit: row.unitId ?
        (state.configurator.dicts.units.byId ?
          state.configurator.dicts.units.byId[row.unitId].symbolicName ||
          state.configurator.dicts.units.byId[row.unitId].name : "Загрузка...") : null,
      member: row.memberId ?
        (state.configurator.dicts.members.byId ?
          state.configurator.dicts.members.byId[row.memberId] : "Загрузка...") : null,
      dimension: row.dimensionId ?
        (state.configurator.dicts.dimensions.byId ?
          state.configurator.dicts.dimensions.byId[row.dimensionId] : "Загрузка...") : null,
      parentRow: rows && rows[row.parentRowId] && row.rowNumber !== rows[row.parentRowId].rowNumber ?
        rows[row.parentRowId].rowNumber : null,
      isText: row.isText,
      isSumOfChildren: row.isSumOfChildren,
      isColumnsUnion: row.isColumnsUnion,
      description: row.description,
      sortOrder: row.sortOrder
    };
  }), ["sortOrder"], ["asc"]);
}