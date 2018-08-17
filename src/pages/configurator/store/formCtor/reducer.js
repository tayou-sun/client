import { combineReducers } from "redux";
import tableParts from "../tableParts/reducer";
import tableRows from "../tableRows/reducer";
import tableColumns from "../tableColumns/reducer";
import step from "./step/reducer";
import formId from "./formId/reducer";
import checker from "./checker/reducer"

export default combineReducers({
  formId,
  step,
  tableParts,
  tableRows,
  tableColumns,
  checker
});
