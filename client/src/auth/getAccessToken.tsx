import getHashedCredString from "./getHashedCredString"
import { AUTH_BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests"
import requests from "SymptomCheckerApi/ApiUtilities/requests"

const getAccessToken = (): Promise<any> => {
  const login_uri: string = AUTH_BASE_URL + "/login"

  // keep cred secure in an .env file
  const api_key: string = "YOUR_USERNAME" // the username to access the api
  const secret_key: string = "YOUR_PASSWORD" // corresponding password to access the api
  const hashed_credentials: string = getHashedCredString(login_uri, secret_key)
  const methods = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}:${hashed_credentials}`
    }
  }
  const tokenPromise = requests(login_uri, methods)

  return tokenPromise
}

export default getAccessToken
