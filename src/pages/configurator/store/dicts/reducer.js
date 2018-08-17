import _ from "lodash";
import * as actions from "./actions";
import { createSelector } from "reselect";

const initialState = {
  periods: {
    byId: null,
    allIds: [],
    isLoading: false
  },
  tablePartTypes: {
    byId: null,
    allIds: [],
    isLoading: false
  },
  members: {
    byId: null,
    allIds: [],
    isLoading: false
  },
  units: {
    byId: null,
    allIds: [],
    isLoading: false
  },
  dimensions: {
    byId: null,
    allIds: [],
    isLoading: false
  },
  valueTypes: {
    byId: null,
    allIds: [],
    isLoading: false
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST_PERIODS:
      return {
        ...state,
        periods: {
          ...state.periods,
          isLoading: true
        }
      };
    case actions.RECEIVE_PERIODS:
      return {
        ...state,
        periods: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    case actions.REQUEST_TABLE_PART_TYPES:
      return {
        ...state,
        tablePartTypes: {
          ...state.tablePartTypes,
          isLoading: true
        }
      };
    case actions.RECEIVE_TABLE_PART_TYPES:
      return {
        ...state,
        tablePartTypes: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    case actions.REQUEST_MEMBERS:
      return {
        ...state,
        members: { ...state.members,
          isLoading: true
        }
      };
    case actions.RECEIVE_MEMBERS:
      return {
        ...state,
        members: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    case actions.REQUEST_UNITS:
      return {
        ...state,
        units: { ...state.units,
          isLoading: true
        }
      };
    case actions.RECEIVE_UNITS:
      return {
        ...state,
        units: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    case actions.REQUEST_DIMENSIONS:
      return {
        ...state,
        dimensions: { ...state.dimensions,
          isLoading: true
        }
      };
    case actions.RECEIVE_DIMENSIONS:
      return {
        ...state,
        dimensions: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    case actions.REQUEST_VALUE_TYPES:
      return {
        ...state,
        valueTypes: {
          ...state.valueTypes,
          isLoading: true
        }
      };
    case actions.RECEIVE_VALUE_TYPES:
      return {
        ...state,
        valueTypes: {
          byId: action.data,
          allIds: _.keys(action.data),
          isLoading: false
        }
      };
    default:
      return state;
  }
}

const getPeriodIds = state => state.configurator.dicts.periods.allIds;
const getPeriodsById = state => state.configurator.dicts.periods.byId;

export const getPeriodList = createSelector(
  [getPeriodIds, getPeriodsById],
  (periodIds, periodsById) =>
  periodIds.map(id => {
    return {
      id,
      name: periodsById[id]
    };
  })
);

const getTablePartTypeIds = state => state.configurator.dicts.tablePartTypes.allIds;
const getTablePartTypesById = state => state.configurator.dicts.tablePartTypes.byId;

export const getTablePartTypeList = createSelector(
  [getTablePartTypeIds, getTablePartTypesById],
  (tablePartTypeIds, tablePartTypesById) =>
  tablePartTypeIds.map(id => {
    return {
      id,
      name: tablePartTypesById[id]
    };
  })
);

const getMemberIds = state => state.configurator.dicts.members.allIds;
const getMembersById = state => state.configurator.dicts.members.byId;

export const getMemberList = createSelector(
  [getMemberIds, getMembersById],
  (memberIds, membersById) =>
  memberIds.map(id => {
    return {
      id,
      name: membersById[id]
    };
  })
);

const getUnitIds = state => state.configurator.dicts.units.allIds;
const getUnitsById = state => state.configurator.dicts.units.byId;

export const getUnitList = createSelector(
  [getUnitIds, getUnitsById],
  (unitIds, unitsById) =>
  unitIds.map(id => {
    const unit = unitsById[id];
    return {
      id,
      name: unit.name + (unit.symbolicName ? " (" + unit.symbolicName + ")" : "")
    };
  })
);

const getDimensionIds = state => state.configurator.dicts.dimensions.allIds;
const getDimensionsById = state => state.configurator.dicts.dimensions.byId;

export const getDimensionList = createSelector(
  [getDimensionIds, getDimensionsById],
  (dimensionIds, dimensionsById) =>
    dimensionIds.map(id => {
      return {id, name: dimensionsById[id]}
    })
);

const getValueTypeIds = state => state.configurator.dicts.valueTypes.allIds;
const getValueTypesById = state => state.configurator.dicts.valueTypes.byId;

export const getValueTypes = createSelector(
  [getValueTypeIds, getValueTypesById],
  (valueTypeIds, valueTypesById) =>
  valueTypeIds.map(id => {
    return {
      id,
      name: valueTypesById[id]
    };
  })
);