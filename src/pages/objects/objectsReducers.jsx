// prettier-ignore
import { 
	OBJ__GET_OBJECTS__SUCCESS,
	OBJ__GET_OBJECTS__ERROR 
} from "./objectsConstants";
// prettier-ignore-end
import _ from "lodash";

const initialState = {};

export default function objects(state = initialState, action) {
  switch (action.type) {
    case OBJ__GET_OBJECTS__SUCCESS:
      const usedCodes = _.map(action.data, x => x.code);
      const newValues = _.pick(state.selectedFilterValues, function(value, key, object) {
        return _.any(usedCodes, item => item === key);
      });

      return {
        ...state,
        filters: action.data,
        selectedFilterValues: newValues,
        error: ""
      };
    default:
      return state;
  }
}
