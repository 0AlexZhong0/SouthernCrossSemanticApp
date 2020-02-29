import { AUTH_BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests";
import { MyError } from "utils/MyError";
import getHashedCredString from "./getHashedCredString";
import requests from "SymptomCheckerApi/ApiUtilities/requests";

export class InvalidCredentialError extends MyError {}

export const getAccessToken = (): Promise<any> => {
  const login_uri: string = AUTH_BASE_URL + "/login";

  // keep cred secure in an .env file
  const userName: string | undefined = process.env.REACT_APP_SANDBOX_USRNAME;
  const password: string | undefined = process.env.REACT_APP_SANDBOX_PASSWORD;

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
