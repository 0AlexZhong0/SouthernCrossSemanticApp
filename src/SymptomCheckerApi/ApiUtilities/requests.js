const fetch = require("node-fetch");

// api legacy functions
const validateResponse = res => {
  if (!res.ok) {
    throw Error(res.statusText);
  } else {
    return res;
  }
};

const readResponseAsJSON = res => {
  return res.json();
};

const logError = err => {
  console.log(`The error is ${err}`);
};

const requests = (uri, methods = {method: 'GET'}) => {
  // default is a GET request
  const apiPromise = fetch(uri, methods)
    .then(validateResponse)
    .then(readResponseAsJSON)
    .catch(logError);

  return apiPromise;
};

module.exports = requests
