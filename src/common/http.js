/**
 * Abstract HTTP client to access API.
 */
import axios from "axios";

export function get(url, options) {
  return axios.get(url, options);
}

export function post(url, params) {
  return axios.post(url, params, {
    "Content-Type": "application/json"
  });
}

export function remove(url, params) {
  return axios.delete(url, params);
}
