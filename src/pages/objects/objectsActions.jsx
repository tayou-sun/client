// prettier-ignore
import { 
	OBJ__GET_OBJECTS__SUCCESS,
	OBJ__GET_OBJECTS__ERROR
} from "./objectsConstants";
// prettier-ignore-end
import { get, post } from "common/http";
import config from "config/config";

export function getObjectsSuccess(data) {
  return {
    type: OBJ__GET_OBJECTS__SUCCESS,
    data: data
  };
}

export function getObjectsError(exc) {
  return {
    type: OBJ__GET_OBJECTS__ERROR,
    data: exc
  };
}

export function getObjectsTab(selectedFilters) {
  const dataToSend = selectedFilters || {};
  return dispatch => {
    post(config.apiUrl.objects.getTab, dataToSend).then(response => {
      dispatch(getObjectsSuccess(response.data.objects));
    });
    // .then(() => {
    //   dispatch(updateFiltersSelection());
    // });
    // .catch(exc => {
    //   dispatch(getFiltersError(exc));
    // });
  };
}
