// prettier-ignore
import { 
  HOME__GET_FILTERS_SUCCESS, 
  HOME__GET_FILTERS_ERROR, 
  FILTER_PANEL__CHANGE_FILTER_SELECTION, 
  FILTER_PANEL__UPDATE_FILTER_SELECTION,
  FILTER_PANEL__CLEAR_UNUSED_SELECTION, 
  FILTER_PANEL__FILTER_SELECT_ALL, 
  FILTER_PANEL__FILTER_UNSELECT_ALL, 
  
  FILTER__EXPAND,
  FILTER__COLLAPSE,
  SIDEBAR__HIDE, 
  SIDEBAR__SHOW } from "./homeConstants";
// prettier-ignore-end
import _ from "lodash";

// не удалять, добавлено сознательно || с lodash, т.к. логика изначально была написана с испольхзованием методов underscore, а их реализация в lodash видимо отличается...
import { _ as __ } from "underscore";

const initialState = {
  filters: [],
  selectedFilterValues: {},
  filtersExpandState: {},
  filters: [
    {
      code: "TRANS_TYPE",
      name: "Виды транспорта",
      allowedValues: [
        { id: 1, text: "Авто", isActive: true },
        { id: 2, text: "Воздушный", isActive: true },
        { id: 3, text: "Железнодорожный", isActive: true },
        { id: 4, text: "Морской", isActive: true }
      ],
      order: 0
    },
    {
      code: "ROAD",
      name: "АВТО",
      allowedValues: [
        { id: 1, text: "В1", isActive: true },
        { id: 2, text: "В2", isActive: true },
        { id: 3, text: "В3", isActive: true },
        { id: 4, text: "В4", isActive: true }
      ],
      order: 1
    }
  ],
  error: "",
  sidebar: {
    isActive: false
  }
};

export default function home(state = initialState, action) {
  switch (action.type) {
    case HOME__GET_FILTERS_SUCCESS:
      const usedCodes = __.map(action.data, x => x.code);
      const newValues = __.pick(state.selectedFilterValues, function(value, key, object) {
        return __.any(usedCodes, item => item === key);
      });

      return {
        ...state,
        filters: action.data,
        selectedFilterValues: newValues,
        error: ""
      };

    case HOME__GET_FILTERS_ERROR:
      return {
        ...state,
        error: data.error
      };

    case FILTER__EXPAND:
      return {
        ...state,
        filtersExpandState: {
          ...state.filtersExpandState,
          [action.data]: true
        }
      };
    case FILTER__COLLAPSE:
      return {
        ...state,
        filtersExpandState: {
          ...state.filtersExpandState,
          [action.data]: false
        }
      };

    case FILTER_PANEL__CHANGE_FILTER_SELECTION: {
      const { filterCode, selectedValue, isSelected } = action.data;
      const target = state.selectedFilterValues[filterCode] || [];

      return {
        ...state,
        selectedFilterValues: {
          ...state.selectedFilterValues,
          [filterCode]: isSelected
            ? [...target, selectedValue]
            : target.filter(function(item, index) {
                return item != selectedValue;
              })
        }
      };
    }
    case FILTER_PANEL__UPDATE_FILTER_SELECTION: {
      var target = {};
      _.each(
        state.filters,
        x => (target[x.code] = _.intersection(_.map(_.filter(x.allowedValues, v => v.isActive), x => x.id), state.selectedFilterValues[x.code]))
      );
      return {
        ...state,
        selectedFilterValues: target
      };
    }

    case FILTER_PANEL__FILTER_SELECT_ALL: {
      const { filterCode, selectedData } = action.data;

      return {
        ...state,
        selectedFilterValues: {
          ...state.selectedFilterValues,
          [filterCode]: selectedData
        }
      };
    }

    case FILTER_PANEL__FILTER_UNSELECT_ALL: {
      const { filterCode } = action.data;
      const target = [];
      return {
        ...state,
        selectedFilterValues: {
          ...state.selectedFilterValues,
          [filterCode]: target
        }
      };
    }
    case SIDEBAR__HIDE:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isActive: false
        }
      };

    case SIDEBAR__SHOW:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isActive: true
        }
      };
    default:
      return state;
  }
}
