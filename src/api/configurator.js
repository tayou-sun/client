import { get, post, remove } from "../common/http";
import config from "../config/config";

const baseUrl = `${config.apiUrl.base}/api/v1/`;

const getPeriods = () => get(`${baseUrl}dictionaries/periods`).then(response => response.data);

const getTablePartTypes = () => get(`${baseUrl}dictionaries/tablePartTypes`).then(response => response.data);

const getForms = (orgId) => get(`${baseUrl}forms?orgId=${orgId}`).then(response => response.data);

const saveFormDetails = data => post(`${baseUrl}forms`, data).then(response => response.data);

const deleteForm = formId => remove(`${baseUrl}forms/${formId}`).then(response => response.data);

const getTableParts = formId => get(`${baseUrl}formConstructor/${formId}/tableParts`).then(response => response.data);

const saveTablePart = (formId, data) => post(`${baseUrl}formConstructor/${formId}/tableParts`, data).then(response => response.data);

const deleteTablePart = (formId, partId) => remove(`${baseUrl}formConstructor/${formId}/tableParts/${partId}`).then(response => response.data);

const getMembers = () => get(`${baseUrl}dictionaries/members`).then(response => response.data);

const getUnits = () => get(`${baseUrl}dictionaries/units`).then(response => response.data);

const getTableRows = (formId, partId) => get(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/rows`).then(response => response.data);

const postTableRow = (formId, partId, data) => post(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/rows`, data).then(response => response.data);

const getDimensions = () => get(`${baseUrl}dictionaries/dimensions`).then(response => response.data);

const deleteTableRow = (formId, partId, rowId) =>
  remove(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/rows/${rowId}`)
  .then(response => response.data);

const getDimMembers = dimId => get(`${baseUrl}dictionaries/dimmembers/${dimId}`).then(response => response.data);

const getValueTypes = () => get(`${baseUrl}dictionaries/valueTypes`).then(response => response.data);

const getTableColumns = (formId, partId) => get(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/columns`).then(response => response.data);

const postTableColumn = (formId, partId, data) =>
  post(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/columns`, data).then(response => response.data);

const deleteTableColumn = (formId, partId, columnId) =>
  remove(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/columns/${columnId}`)
  .then(response => response.data);

const getFormCheckerMessages = formId =>
  get(`${baseUrl}forms/check/${formId}`).then(response => response.data);

const getPivotTableData = (formId, partId) =>
  get(`${baseUrl}formConstructor/${formId}/tableParts/${partId}/pivot`).then(response => response.data);

export default {
  getPeriods,
  getTablePartTypes,
  getUnits,
  getMembers,
  getDimensions,
  getDimMembers,
  getValueTypes,
  getForms,
  saveFormDetails,
  deleteForm,
  getTableParts,
  saveTablePart,
  deleteTablePart,
  getTableRows,
  postTableRow,
  deleteTableRow,
  getTableColumns,
  postTableColumn,
  deleteTableColumn,
  getFormCheckerMessages,
  getPivotTableData
};
