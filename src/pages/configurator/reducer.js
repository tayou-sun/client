import { combineReducers } from "redux";
import main from "./store/main/reducer";
import dicts from "./store/dicts/reducer";
import organizations from "./store/organizations/reducer";
import forms from "./store/forms/reducer";
import formCtor from "./store/formCtor/reducer";

export default combineReducers({ main, dicts, organizations, forms, formCtor });
