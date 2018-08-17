import { get, post, remove } from "../common/http";
import config from "../config/config";

const baseUrl = `${config.apiUrl.base}/api/v1/`;

const getCampaigns = (orgId, subs, active, date) => {
  let parameters = "";
  if (orgId !== undefined && orgId !== null) parameters += `orgId=${orgId}`
  if (subs !== undefined && subs !== null) parameters = parameters + (parameters === "" ? "" : "&") +`subs=${subs}`;
  if (active !== undefined && active !== null ) parameters = parameters + (parameters === "" ? "" : "&") +`active=${active}`;
  if (date !== undefined && date !== null ) parameters = parameters + (parameters === "" ? "" : "&") +`date=${date}`;

  return get(`${baseUrl}campaigns`+ (parameters === "" ? "" : "?" + parameters)).then(response => response.data);
}

const getCampaignInfo = campaignId =>
  get(`${baseUrl}campaigns/${campaignId}`).then(response => response.data);

const getFormInfo = formId =>
  get(`${baseUrl}forms/${formId}`).then(response => response.data);

const getOrganizations = () =>
  get(`${baseUrl}dictionaries/organizations`).then(response => response.data);

const getBatchId = (campaignId, formId, orgId, date) =>
  get(`${baseUrl}campaigns/${campaignId}/forms/${formId}/batchId?orgId=${orgId}&date=${date}`)
  .then(response => response.data);
  
const getTablePartForEditing = (formId, partId, batchId) =>
  get(`${baseUrl}forms/${formId}/partsForEditing/${partId}?batchId=${batchId}`)
  .then(response => response.data);

const postDataToSave = data =>
  post(`${baseUrl}forms/saveData`, data).then(response => response.data);

const postBatchToFact = batchId =>
  post(`${baseUrl}batches/${batchId}/complete`).then(response => response.data);

export default {
  getCampaigns,
  getCampaignInfo,
  getFormInfo,
  getOrganizations,
  getBatchId,
  getTablePartForEditing,
  postDataToSave,
  postBatchToFact
}