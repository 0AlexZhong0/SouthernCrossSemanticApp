import { AUTH_BASE_URL } from "symptomCheckerApi/utils/requests";
import { MyError } from "utils/MyError";
import getHashedCredString from "./getHashedCredString";
import requests from "symptomCheckerApi/utils/requests";

export class InvalidCredentialError extends MyError {}

export const getAccessToken = (): Promise<any> => {
  const login_uri: string = AUTH_BASE_URL + "/login";

  // keep cred secure in an .env file
  const userName: string | undefined =
    process.env.REACT_APP_ENVIRONMENT === "dev"
      ? process.env.REACT_APP_SANDBOX_USRNAME
      : process.env.REACT_APP_LIVE_USRNAME;

  const password: string | undefined =
    process.env.REACT_APP_ENVIRONMENT === "dev"
      ? process.env.REACT_APP_SANDBOX_PASSWORD
      : process.env.REACT_APP_LIVE_PASSWORD;

  if (!userName) throw new InvalidCredentialError("Invalid api username");
  if (!password) throw new InvalidCredentialError("Invalid api password");

  const hashed_credentials: string = getHashedCredString(login_uri, password);
  const methods = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userName}:${hashed_credentials}`
    }
  };

  const tokenPromise = requests(login_uri, methods);

  return tokenPromise;
};
