/**
 * API to access dashboard HTTP server.
 * TODO: auth/tokens should be encapsulated here.
 */
import { get, post } from 'common/http';
import config from '../config/config';

const baseUrl = `${config.apiUrl.base}/api/v1/`;

const getEntity = id => {
  console.log(baseUrl);
  return get(`${baseUrl}entity/${id}`)
    .then(response => response.data);
};

export default {
  getEntity
};
