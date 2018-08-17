// prettier-ignore
import { 
  HOME__GET_FILTERS_SUCCESS, 
  HOME__GET_FILTERS_ERROR, 
  FILTER_PANEL__CHANGE_FILTER_SELECTION, 
  FILTER_PANEL__UPDATE_FILTER_SELECTION, 
  FILTER_PANEL__FILTER_SELECT_ALL, 
  FILTER_PANEL__FILTER_UNSELECT_ALL, 
  FILTER__EXPAND,
  FILTER__COLLAPSE,
  SIDEBAR__SHOW, 
  SIDEBAR__HIDE } from "./homeConstants";
// prettier-ignore-end
import { get, post } from "common/http";
import config from "config/config";

export function getFiltersSuccess(data) {
  return {
    type: HOME__GET_FILTERS_SUCCESS,
    data: data
  };
}

export function expandFilter(filterCode) {
  return {
    type: FILTER__EXPAND,
    data: filterCode
  };
}
export function collapseFilter(filterCode) {
  return {
    type: FILTER__COLLAPSE,
    data: filterCode
  };
}

export function getFiltersError(exc) {
  return {
    type: HOME__GET_FILTERS_ERROR,
    data: exc
  };
}

export function selectAllValuesByFilter(filterCode, selectedData) {
  return {
    type: FILTER_PANEL__FILTER_SELECT_ALL,
    data: {
      filterCode,
      selectedData
    }
  };
}

export function unselectAllValuesByFilter(filterCode) {
  return {
    type: FILTER_PANEL__FILTER_UNSELECT_ALL,
    data: {
      filterCode
    }
  };
}

export function updateFiltersSelection() {
  return {
    type: FILTER_PANEL__UPDATE_FILTER_SELECTION
  };
}

export function getFilters(selectedFilters) {
  const dataToSend = selectedFilters || {};
  return dispatch => {
    post(config.apiUrl.filters.get, dataToSend)
      .then(response => {
        dispatch(getFiltersSuccess(response.data.filters));
      })
      .then(() => {
        dispatch(updateFiltersSelection());
      });
    // .catch(exc => {
    //   dispatch(getFiltersError(exc));
    // });
  };
}

export function changeFilterSelection(filterCode, selectedValue, isSelected) {
  return {
    type: FILTER_PANEL__CHANGE_FILTER_SELECTION,
    data: {
      filterCode,
      selectedValue,
      isSelected
    }
  };
}

export function showSidebar() {
  return { type: SIDEBAR__SHOW };
}
export function hideSidebar() {
  return { type: SIDEBAR__HIDE };
}
