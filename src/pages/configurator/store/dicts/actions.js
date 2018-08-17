import api from "../../../../api/configurator";

export const REQUEST_PERIODS = "REQUEST_PERIODS";
export const RECEIVE_PERIODS = "RECEIVE_PERIODS";

export const REQUEST_TABLE_PART_TYPES = "REQUEST_TABLE_PART_TYPES";
export const RECEIVE_TABLE_PART_TYPES = "RECEIVE_TABLE_PART_TYPES";

export const REQUEST_MEMBERS = "REQUEST_MEMBERS";
export const RECEIVE_MEMBERS = "RECEIVE_MEMBERS";

export const REQUEST_UNITS = "REQUEST_UNITS";
export const RECEIVE_UNITS = "RECEIVE_UNITS";

export const REQUEST_DIMENSIONS = "REQUEST_DIMENSIONS";
export const RECEIVE_DIMENSIONS = "RECEIVE_DIMENSIONS";

export const REQUEST_VALUE_TYPES = "REQUEST_VALUE_TYPES";
export const RECEIVE_VALUE_TYPES = "RECEIVE_VALUE_TYPES";

export function receivePeriods(data) {
  return {
    type: RECEIVE_PERIODS,
    data
  };
}

export function receiveTablePartTypes(data) {
  return {
    type: RECEIVE_TABLE_PART_TYPES,
    data
  };
}

export function receiveMembers(data) {
  return {
    type: RECEIVE_MEMBERS,
    data
  };
}

export function receiveUnits(data) {
  return {
    type: RECEIVE_UNITS,
    data
  };
}

export function receiveDimensions(data) {
  return {
    type: RECEIVE_DIMENSIONS,
    data
  };
}

export function receiveValueTypes(data) {
  return {
    type: RECEIVE_VALUE_TYPES,
    data
  };
}

const periodsAreLoaded = state =>
  state.configurator.dicts.periods.isLoading ||
  state.configurator.dicts.periods.byId;

export function loadPeriods() {
  return (dispatch, getState) => {
    if (periodsAreLoaded(getState())) return;
    dispatch({
      type: REQUEST_PERIODS
    });
    return api.getPeriods()
      .then(data => dispatch(receivePeriods(data)));
  };
}

const tablePartTypesAreLoaded = state =>
  state.configurator.dicts.tablePartTypes.isLoading ||
  state.configurator.dicts.tablePartTypes.byId;

export function loadTablePartTypes() {
  return (dispatch, getState) => {
    if (tablePartTypesAreLoaded(getState())) return;
    dispatch({
      type: REQUEST_TABLE_PART_TYPES
    });
    return api.getTablePartTypes()
      .then(data => dispatch(receiveTablePartTypes(data)));
  };
}

const membersAreLoaded = state =>
  state.configurator.dicts.members.isLoading ||
  state.configurator.dicts.members.byId;

export function loadMembers() {
  return (dispatch, getState) => {
    if (membersAreLoaded(getState()))
      return;
    dispatch({
      type: REQUEST_MEMBERS
    });
    return api.getMembers()
      .then(data => dispatch(receiveMembers(data)));
  };
}

const unitsAreLoaded = state =>
  state.configurator.dicts.units.isLoading ||
  state.configurator.dicts.units.byId;

export function loadUnits() {
  return (dispatch, getState) => {
    if (unitsAreLoaded(getState()))
      return Promise.resolve();

    dispatch({
      type: REQUEST_UNITS
    });
    return api.getUnits()
      .then(data => dispatch(receiveUnits(data)));
  };
}

const dimensionsAreLoaded = state =>
  state.configurator.dicts.dimensions.isLoading ||
  state.configurator.dicts.dimensions.byId;

export function loadDimensions() {
  return (dispatch, getState) => {
    if (dimensionsAreLoaded(getState()))
      return Promise.resolve();

    dispatch({
      type: REQUEST_DIMENSIONS
    });
    return api.getDimensions()
      .then(data => dispatch(receiveDimensions(data)));
  };
}

const valueTypesAreLoaded = state =>
  state.configurator.dicts.valueTypes.isLoading ||
  state.configurator.dicts.valueTypes.byId;

export function loadValueTypes() {
  return (dispatch, getState) => {
    if (valueTypesAreLoaded(getState()))
      return Promise.resolve();

    dispatch({
      type: REQUEST_VALUE_TYPES
    });
    return api.getValueTypes()
      .then(data => dispatch(receiveValueTypes(data)));
  };
}