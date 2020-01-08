import * as CryptoJS from "crypto-js"

const getHashString = (uri: string, secret_key: string): string => {
  const computedHash = CryptoJS.HmacMD5(uri, secret_key)
  const computedHashString = computedHash.toString(CryptoJS.enc.Base64)
  return computedHashString
}

export default getHashString
