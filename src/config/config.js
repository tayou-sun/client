export default (function config() {
  // const base = location.protocol + "//" + location.host;
  const base = "https://localhost:44385";
  const api = "/api";
  const filters = {
    get: base + api + "/Filter/getFilters"
  };
  const objects = {
    getTab: base + api + "/objects/getObjectsByFilterForTab",
    getObjectInfo: base + api + "/objects",
    getConnectedObjects: base + api + "/objects/getConnectedObjects"
  };
  const logging = {
    console: true
  };
  return {
    apiUrl: {
      base,
      api,
      filters,
      objects
    },
    logging
  };
})();
