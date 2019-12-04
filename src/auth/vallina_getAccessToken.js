// convert the code below into TypeScript
const getHashedString = require("./vallina_getHashedCred");
const fetch = require("node-fetch");

function validateResponse(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  } else {
    return res;
  }
}

function readResponseAsJSON(res) {
  return res.json();
}

function logResult(res) {
  console.log(res)
}

function logError(err) {
  console.log(`The error is ${JSON.stringify(err)}`);
}

// the function should return a promise instead of console logging the result?
function getTokenResponse() {
  const BASE_URL = "https://sandbox-authservice.priaid.ch/"; // maybe able to refactor if end up using it somewhere else
  const login_uri = BASE_URL + "login";

  // keep cred secure in an .env file
  const api_key = "919805935@qq.com"; // the username to access the api
  const secret_key = "s6D4Mbg3A9KaZo72L"; // corresponding password to access the api
  const hashed_credentials = getHashedString(login_uri, secret_key);
  fetch(login_uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}:${hashed_credentials}`
    }
  })
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(logResult)
    .catch(logError);
}

console.log(getTokenResponse());
