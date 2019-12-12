const requests = (
  uri: string,
  init?: RequestInit | undefined
  ): Promise<Response> => {
    // default is a GET request
    const apiPromise = fetch(uri, init)
  
   .then(
      (res: Response): Response => {
        if (!res.ok) {
          throw Error(res.statusText);
        } else {
          return res;
        }
      }
    )
    .then(
      (result: Response): Promise<any> => {
        return result.json();
      }
    )
    .catch((err: Response): void => console.log(`The error is ${err}`));

  return apiPromise;
};

export const AUTH_BASE_URL = "https://sandbox-authservice.priaid.ch";
export const HEALTH_BASE_URL = "https://sandbox-healthservice.priaid.ch"
export default requests;
