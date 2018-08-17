// TODO: use log4js

const log = data => {
  console.log(data);
};
const error = error => {
  if (error.response) {
    console.warn(error.response.data);
    console.warn(error.response.status);
    console.warn(error.response.headers);
  } else {
    console.warn("Error", error.message || error);
  }
};

export default {
  log: log,
  error: error
};
