const CryptoJS = require("crypto-js");

function getHashString(uri, secret_key) {
  const computedHash = CryptoJS.HmacMD5(uri, secret_key);
  const computedHashString = computedHash.toString(CryptoJS.enc.Base64);
  return computedHashString;
}

// Test example
// const uri = "https://authservice.priaid.ch/login"
// const secret_key = "mysecretkey"
// const hashString = getHashString(uri, secret_key)

// console.log(hashString);

module.exports = getHashString
