// convert the code below into TypeScript
const getHashedString = require("./getHashedCredString");
const BASE_URL = require("../SymptomCheckerApi/ApiUtilities/baseUrl");
const requests = require("../SymptomCheckerApi/ApiUtilities/requests");

// the function should return a promise instead of console logging the result?
function getAccessToken() {
  const login_uri = BASE_URL + "/login";

  // keep cred secure in an .env file
  const api_key = "919805935@qq.com"; // the username to access the api
  const secret_key = "s6D4Mbg3A9KaZo72L"; // corresponding password to access the api
  const hashed_credentials = getHashedString(login_uri, secret_key);
  const methods = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}:${hashed_credentials}`
    }
  };
  const tokenPromise = requests(login_uri, methods);

  return tokenPromise;
}

module.exports = getAccessToken;
